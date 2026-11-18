import type { Metadata } from 'next';
import { IntegratedReview } from './review';
import './review.css';
export const metadata: Metadata = { title: 'PFM Commercial Experience — integrated review', robots: { index: false, follow: false } };
export default function IntegratedReviewPage() { return <IntegratedReview />; }
