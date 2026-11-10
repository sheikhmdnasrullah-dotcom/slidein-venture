import type { Metadata } from 'next';
import Workspace from '@/components/Workspace/Workspace';

export const metadata: Metadata = {
  title: 'Workspace | SlideIn',
  description:
    'Every outreach stage on one canvas, with the work on each prospect on a timeline. Nothing sends until you approve it in the dashboard.',
};

export default function WorkspacePage() {
  return <Workspace />;
}
