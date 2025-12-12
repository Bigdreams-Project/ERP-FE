import TicketDetails from "@/content/dashboard/settings/tickets/TicketDetails";

export default async function Ticket({ params }: any) {
  const { id } = await params;

  return <TicketDetails ticketId={id} />;
}

