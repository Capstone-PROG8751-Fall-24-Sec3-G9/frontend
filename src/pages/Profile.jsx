import { useState } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { toast } from "react-toastify";
import { jsPDF } from "jspdf";

const Profile = () => {
  const { VITE_Paypal_Client_ID } = import.meta.env;

  const initialOptions = {
    "client-id": VITE_Paypal_Client_ID,
    currency: "CAD",
  };

  const [amount, setAmount] = useState(5);

  const generatePDF = (details) => {
    const { payer, purchase_units } = details;

    const doc = new jsPDF();

    doc.addImage("./logo.jpeg", "JPEG", 10, 10, 50, 20);
    doc.setFontSize(18);
    doc.text("Donation Receipt", 105, 20, null, null, "center");
    doc.setFontSize(14);
    doc.text(
      `Thank you, ${payer.name.given_name}, for your generous donation!`,
      20,
      40
    );
    doc.text(`Amount: $${purchase_units[0].amount.value}`, 20, 60);
    doc.text(`Transaction ID: ${details.id}`, 20, 80);
    doc.text(`Date: ${new Date().toLocaleString()}`, 20, 100);
    doc.save("donation_recipt.pdf");
  };

  return (
    <PayPalScriptProvider options={initialOptions}>
      <div
        id="donation-page"
        className="h-screen bg-cover bg-center"
        style={{
          backgroundImage: "url('./pexels-nitin-arya-386173-1029141.jpg')",
        }}
      >
        <div className="container px-3 mx-auto py-3 text-white">
          <h1 className="text-3xl mb-3">Donation Page</h1>
          <p>
            Thank you for considering to donate to our cause. Your donation will
            help us continue to provide free resources to those in need.
          </p>
          <p>For more information on how to donate, please contact us at</p>
          <br />
          <div className="flex items-center gap-3">
            <label className="text-xl">Amount:</label>
            <input
              type="number"
              className="text-black py-3 px-3 rounded-sm"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
              }}
            />
          </div>
          <div className="mt-4">
            <PayPalButtons
              key={amount}
              createOrder={(data, actions) => {
                return actions.order.create({
                  purchase_units: [
                    {
                      amount: {
                        value: parseFloat(amount).toFixed(2),
                      },
                    },
                  ],
                });
              }}
              onApprove={(data, actions) => {
                return actions.order.capture().then(function (details) {
                  console.log(details.payer.name.given_name);
                  toast(`🦄 Thank you so much for your generous donation!`);
                  generatePDF(details);
                });
              }}
            />
          </div>
        </div>
      </div>
    </PayPalScriptProvider>
  );
};

export default Profile;
