import { redirect } from 'next/navigation';

export default function ParametresRedirect() {
  redirect('/mon-compte?tab=preferences');
}
