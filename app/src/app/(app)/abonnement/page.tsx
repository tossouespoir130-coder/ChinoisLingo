import { redirect } from 'next/navigation';

export default function AbonnementRedirect() {
  redirect('/mon-compte?tab=subscription');
}
