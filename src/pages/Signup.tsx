import { SignupForm } from "@/components/signup/SignupForm";
import { HowItWorks } from "@/components/signup/HowItWorks";

const Signup = () => {
  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: 'url("/lovable-uploads/ba8bdb57-a6ba-4ff3-a3b3-a8892f151b01.png")' }}
    >
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto bg-white/95 rounded-lg shadow-lg p-6 backdrop-blur-sm">
          <h1 className="text-3xl font-bold text-center mb-6">Join MySitterSquad</h1>
          <SignupForm />
        </div>
        <div className="mt-8">
          <HowItWorks />
        </div>
      </div>
    </div>
  );
};

export default Signup;