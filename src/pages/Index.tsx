
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShieldCheck, FileWarning, Users } from "lucide-react";

const Index = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <section className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-brand-800">
          Scam Report Guardian
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          A secure platform for reporting and tracking online scams. Help protect
          yourself and others from fraud by sharing your experiences.
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
          <div className="flex justify-center mb-4 text-brand-600">
            <ShieldCheck size={48} />
          </div>
          <h2 className="text-xl font-semibold mb-3 text-center">
            Report Scams Securely
          </h2>
          <p className="text-gray-600 text-center">
            Submit detailed reports about online scams you've encountered with
            our secure reporting system.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
          <div className="flex justify-center mb-4 text-brand-600">
            <FileWarning size={48} />
          </div>
          <h2 className="text-xl font-semibold mb-3 text-center">
            Browse Recent Reports
          </h2>
          <p className="text-gray-600 text-center">
            View recent scam reports submitted by other users to stay informed
            about current scam tactics.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
          <div className="flex justify-center mb-4 text-brand-600">
            <Users size={48} />
          </div>
          <h2 className="text-xl font-semibold mb-3 text-center">
            Join the Community
          </h2>
          <p className="text-gray-600 text-center">
            Connect with others who have been affected by scams and help build a
            safer online environment.
          </p>
        </div>
      </section>

      <section className="text-center">
        <div className="space-x-4">
          <Link to="/report-scam">
            <Button size="lg" className="bg-brand-600 hover:bg-brand-700">
              Report a Scam
            </Button>
          </Link>
          <Link to="/reports">
            <Button size="lg" variant="outline">
              View Reports
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Index;
