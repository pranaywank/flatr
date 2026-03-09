import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { adminDb } from '@/lib/firebase-admin';
import { ListingDetailClient } from './ListingDetailClient';

interface ListingData {
    city: string;
    neighborhood: string;
    flatSize: string;
    roomsAvailable: number;
    rent: number;
    availableFrom: string;
    description: string;
    photos: string[];
    whatsapp: string;
}

async function getListing(id: string): Promise<ListingData | null> {
    if (!adminDb) return null;
    try {
        const doc = await adminDb.collection('listings').doc(id).get();
        if (!doc.exists) return null;
        const data = doc.data();
        if (!data) return null;
        // Explicitly return only plain serializable fields — Firestore Timestamp
        // class instances (e.g. createdAt) cannot be passed to Client Components.
        return {
            city: data.city ?? '',
            neighborhood: data.neighborhood ?? '',
            flatSize: data.flatSize ?? '',
            roomsAvailable: data.roomsAvailable ?? 0,
            rent: data.rent ?? 0,
            availableFrom: data.availableFrom ?? '',
            description: data.description ?? '',
            photos: data.photos ?? [],
            whatsapp: data.whatsapp ?? '',
        };
    } catch {
        return null;
    }
}

export async function generateMetadata(
    { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
    const { id } = await params;
    const listing = await getListing(id);
    if (!listing) return { title: 'Listing not found | Flatr' };
    const title = `${listing.flatSize} in ${listing.neighborhood}, ${listing.city} | Flatr`;
    const description = `₹${listing.rent.toLocaleString('en-IN')}/mo · Available from ${new Date(listing.availableFrom).toLocaleDateString()} · ${listing.description.slice(0, 140)}…`;
    const imageUrl = listing.photos[0];
    return {
        title,
        description,
        openGraph: { title, description, images: [{ url: imageUrl }], type: 'website' },
        twitter: { card: 'summary_large_image', title, description, images: [imageUrl] },
    };
}

export default async function ListingDetailPage(
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const listing = await getListing(id);
    if (!listing) notFound();
    return <ListingDetailClient listing={listing} />;
}
