
import React from 'react';
import { useAppStore } from '../../store/useAppStore.ts';
import { Mail, Phone, Star } from 'lucide-react';

const CustomerInfo: React.FC = () => {
  const customer = useAppStore(state => state.customer);

  if (!customer) {
    return <div className="text-gray-400">No customer data available.</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <img src={customer.avatarUrl} alt={customer.name} className="w-16 h-16 rounded-full border-2 border-blue-400" />
        <div>
          <h4 className="text-xl font-bold text-white">{customer.name}</h4>
          <span className="text-sm font-semibold bg-yellow-500/20 text-yellow-300 px-2 py-0.5 rounded-full flex items-center gap-1 w-fit">
             <Star className="w-3 h-3" /> {customer.tier} Member
          </span>
        </div>
      </div>
      <div className="text-sm space-y-2 pt-2 border-t border-gray-700">
        <div className="flex items-center gap-2 text-gray-300">
          <Mail className="w-4 h-4 text-gray-400" />
          <span>{customer.email}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-300">
          <Phone className="w-4 h-4 text-gray-400" />
          <span>{customer.phone}</span>
        </div>
      </div>
    </div>
  );
};

export default CustomerInfo;
