import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import TransferCard from '../components/finance/TransferCard';

const Transfers = () => {
  const navigate = useNavigate();

  const handleTransferSuccess = () => {
    toast.success('Transfer completed successfully!');
    // Optional: Redirect to Dashboard after a short delay
    setTimeout(() => {
      navigate('/');
    }, 1500);
  };

  return (
    <div className="p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">Send Money</h1>
        <TransferCard onSuccess={handleTransferSuccess} />
      </div>
    </div>
  );
};

export default Transfers;

