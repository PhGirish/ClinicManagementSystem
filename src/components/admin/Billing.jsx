import React, { useState } from "react";
import { useReactToPrint } from "react-to-print";
import "./Billing.css";

const Billing = () => {
  const [selectedServices, setSelectedServices] = useState([]);
  const [extraCharge, setExtraCharge] = useState(0);
  const [billingList, setBillingList] = useState([]);

  const services = [
    { name: "General Checkup", cost: 50 },
    { name: "Cleaning", cost: 80 },
    { name: "Cavity Filling", cost: 120 },
    { name: "Root Canal", cost: 300 },
    { name: "Orthodontics", cost: 500 },
  ];

  const handleAddService = (e) => {
    const service = services.find((service) => service.name === e.target.value);
    if (service) {
      setSelectedServices([...selectedServices, service]);
    }
  };

  const handleRemoveService = (serviceName) => {
    setSelectedServices(
      selectedServices.filter((service) => service.name !== serviceName)
    );
  };

  const handleAddToBilling = () => {
    const totalCost =
      selectedServices.reduce((sum, service) => sum + service.cost, 0) +
      parseFloat(extraCharge);

    setBillingList([
      ...billingList,
      { services: selectedServices, extraCharge, totalCost },
    ]);

    // Reset the selections
    setSelectedServices([]);
    setExtraCharge(0);
  };

  const componentRef = React.useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
    <div className="billing-container">
      <div className="billing-form">
        <h1 className="bill-head">Billing System</h1>

        <select onChange={handleAddService} defaultValue="">
          <option value="" disabled>
            Select Service
          </option>
          {services.map((service) => (
            <option key={service.name} value={service.name}>
              {service.name} (${service.cost})
            </option>
          ))}
        </select>
        <div className="selected-services">
          {selectedServices.map((service) => (
            <div key={service.name} className="selected-service">
              {service.name} (${service.cost})
              <button onClick={() => handleRemoveService(service.name)}>
                Remove
              </button>
            </div>
          ))}
        </div>
        <input
          className="billinput"
          type="number"
          placeholder="Extra Charge"
          value={extraCharge}
          onChange={(e) => setExtraCharge(e.target.value)}
        />
        <button className="billbutton" onClick={handleAddToBilling}>
          Add to Billing List
        </button>
      </div>

      <div className="billing-form" ref={componentRef}>
        <h2 className="bill-head">Billing List</h2>
        <table className="billing-table">
          <thead>
            <tr>
              <th>Services</th>
              <th>Extra Charge</th>
              <th>Total Cost</th>
            </tr>
          </thead>
          <tbody>
            {billingList.map((bill, index) => (
              <tr key={index}>
                <td>
                  {bill.services.map((service) => service.name).join(", ")}
                </td>
                <td>${bill.extraCharge}</td>
                <td>${bill.totalCost}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button className="printbutton" onClick={handlePrint}>
        Print
      </button>
    </div>
  );
};

export default Billing;
