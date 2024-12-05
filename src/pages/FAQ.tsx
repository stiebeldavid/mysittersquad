import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const FAQ = () => {
  return (
    <div className="page-container">
      <h1 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h1>
      
      <Accordion type="single" collapsible className="w-full space-y-4">
        <AccordionItem value="item-1" className="bg-white rounded-lg shadow-sm border p-2">
          <AccordionTrigger className="text-left px-4">
            How does MySitterSquad work?
          </AccordionTrigger>
          <AccordionContent className="px-4 text-gray-600">
            MySitterSquad helps you coordinate with your trusted babysitters. First, add your existing babysitters' contact information. Then, when you need a sitter, create a request and we'll reach out to all your sitters at once. They'll respond with their availability, and you can choose who to book.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2" className="bg-white rounded-lg shadow-sm border p-2">
          <AccordionTrigger className="text-left px-4">
            Will my babysitters be notified when I add them to my list?
          </AccordionTrigger>
          <AccordionContent className="px-4 text-gray-600">
            No, adding a babysitter to your list only stores their information in your account. They will only be contacted when you create a specific sitting request.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-3" className="bg-white rounded-lg shadow-sm border p-2">
          <AccordionTrigger className="text-left px-4">
            How are babysitters contacted when I create a request?
          </AccordionTrigger>
          <AccordionContent className="px-4 text-gray-600">
            When you create a request, we send a message to each of your selected babysitters via their preferred contact method (text, WhatsApp, or email). They receive a unique link to respond with their availability.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-4" className="bg-white rounded-lg shadow-sm border p-2">
          <AccordionTrigger className="text-left px-4">
            Can I see all my past and upcoming requests?
          </AccordionTrigger>
          <AccordionContent className="px-4 text-gray-600">
            Yes, you can view all your requests in the "My Requests" section. This includes past requests, current open requests, and upcoming confirmed bookings.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-5" className="bg-white rounded-lg shadow-sm border p-2">
          <AccordionTrigger className="text-left px-4">
            Is my family's information secure?
          </AccordionTrigger>
          <AccordionContent className="px-4 text-gray-600">
            Yes, your family's information and babysitter contacts are private and only visible to you. We use encryption to protect your data and never share your information with third parties.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-6" className="bg-white rounded-lg shadow-sm border p-2">
          <AccordionTrigger className="text-left px-4">
            What happens after a babysitter responds to my request?
          </AccordionTrigger>
          <AccordionContent className="px-4 text-gray-600">
            You'll receive a notification when a babysitter responds. You can then review all responses in your dashboard and select which sitter you'd like to confirm. Once you confirm a sitter, we'll notify them and update your request status.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default FAQ;