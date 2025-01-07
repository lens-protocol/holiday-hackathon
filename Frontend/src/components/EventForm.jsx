import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { create } from "ipfs-http-client";
import { 
  Upload,
  Calendar,
  Clock,
  MapPin,
  Users,
  Coins,
  FileText,
  Image as ImageIcon,
  Loader2,
  ExternalLink,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { ethers } from 'ethers';
import { useContract } from '../hooks/useContract';

// IPFS configuration
const projectId = '2WCbZ8YpmuPxUtM6PzbFOfY5k4B';
const projectSecretKey = 'c8b676d8bfe769b19d88d8c77a9bd1e2';
const authorization = "Basic " + btoa(projectId + ":" + projectSecretKey);
const ipfs_client = create({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
  apiPath: "/api/v0",
  headers: {
    authorization: authorization
  },
});

export const EventForm = () => {
  const navigate = useNavigate();
  const { contract, address, signer } = useContract();
  const [hasCheckedStake, setHasCheckedStake] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    date: '',
    time: '',
    venue: '',
    capacity: '',
    price: '',
    logo: null,
    category: '' // Add this new field
  });

  const [status, setStatus] = useState({
    isStaked: false,
    isStaking: false,
    isUploading: false,
    isSubmitting: false,
    error: null,
    txHash: null,
    successMessage: null
  });

  // Check if user has already staked
  useEffect(() => {
    const checkStake = async () => {
        if (contract && address && !hasCheckedStake) {
            try {
                const stake = await contract.Stakers(address);
                // console.log(stake)
                setStatus(prev => ({
                    ...prev,
                    isStaked: stake.toString() !== '0'
                }));
                setHasCheckedStake(true);
            } catch (error) {
                console.error('Error checking stake:', error);
            }
        }
    };
    checkStake();
}, [contract, address, hasCheckedStake]);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'logo' && files) {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleStake = async () => {
    console.log(contract);
    if (!contract) return;
    
    setStatus(prev => ({ ...prev, isStaking: true, error: null }));
    try {
      const fromAddress = await signer.getAddress();
      console.log(fromAddress);
      const txPayload = 
      { from :  fromAddress, 
        to : contract.target, 
        value : ethers.parseEther('0.2'), 
      };
      const tx = await signer.sendTransaction(txPayload);
      setStatus(prev => ({ 
        ...prev, 
        txHash: tx.hash,
        successMessage: 'Staking successful! You can now create events.'
      }));
      await tx.wait();
      setStatus(prev => ({ ...prev, isStaked: true }));
    } catch (error) {
      console.log(error);
      setStatus(prev => ({ 
        ...prev, 
        error: 'Staking failed. Please try again.' 
      }));
    } finally {
      setStatus(prev => ({ ...prev, isStaking: false }));
    }
  };

  const uploadToIPFS = async (file) => {
    setStatus(prev => ({ ...prev, isUploading: true, error: null }));
    try {
    //   const formData = new FormData();
    //   formData.append('file', file);
      
    //   const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
    //     method: 'POST',
    //     headers: {
    //       'Authorization': `Bearer ${process.env.VITE_PINATA_JWT}`
    //     },
    //     body: formData
    //   });
      
    //   const data = await response.json();
      const data = await ipfs_client.add(file);
      const cid = data.cid.toString();
      return `https://skywalker.infura-ipfs.io/ipfs/${cid}`;
    } catch (error) {
      throw new Error('Failed to upload to IPFS');
    } finally {
      setStatus(prev => ({ ...prev, isUploading: false }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!contract) return;

    setStatus(prev => ({ 
      ...prev, 
      isSubmitting: true, 
      error: null,
      txHash: null,
      successMessage: null
    }));

    try {
      // Upload logo to IPFS
      const ipfsUrl = await uploadToIPFS(formData.logo);
      console.log(ipfsUrl);
      // Call contract
      const connectedContract = contract.connect(signer);
      const tx = await connectedContract.addEvent(
        address,
        formData.name,
        formData.description,
        formData.date,
        formData.time,
        formData.venue,
        formData.capacity,
        ethers.parseEther(formData.price),
        ipfsUrl,
        formData.category  // Add this
      );

      setStatus(prev => ({ 
        ...prev, 
        txHash: tx.hash,
        successMessage: 'Event created successfully!'
      }));

      await tx.wait();
    //   navigate('/events');
    } catch (error) {
      setStatus(prev => ({ 
        ...prev, 
        error: 'Failed to create event. Please try again.' 
      }));
      console.log(error);
    } finally {
      setStatus(prev => ({ ...prev, isSubmitting: false }));
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-4">
      {/* Gradient Orb Background Effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl" />

      <div className="max-w-4xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl font-bold text-center mb-12">
            <span className="bg-gradient-to-r from-violet-500 to-pink-500 text-transparent bg-clip-text">
              Create Your Event
            </span>
          </h1>

          {!status.isStaked && (
            <Card glowing className="mb-12">
              <div className="text-center p-6">
                <h2 className="text-2xl font-bold mb-4">Stake to Create Events</h2>
                <p className="text-gray-400 mb-6">
                  Stake 0.2 tokens to start creating and managing events on our platform
                </p>
                <Button 
                  onClick={handleStake} 
                  disabled={status.isStaking}
                  className="w-full md:w-auto"
                >
                  {status.isStaking ? (
                    <span className="flex items-center">
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Staking...
                    </span>
                  ) : (
                    'Stake 0.2 Tokens'
                  )}
                </Button>
              </div>
            </Card>
          )}

          <form onSubmit={handleSubmit}>
            <Card glowing>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                <div className="space-y-4">
                  <label className="block">
                    <span className="text-gray-400">Event Name</span>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-lg bg-gray-900 border border-gray-800 focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all duration-200"
                      required
                    />
                  </label>

                  <label className="block">
                    <span className="text-gray-400">Description</span>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-lg bg-gray-900 border border-gray-800 focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all duration-200"
                      rows="4"
                      required
                    />
                  </label>

                  <label className="block">
                    <span className="text-gray-400">Date</span>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                      <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        className="mt-1 block w-full pl-10 rounded-lg bg-gray-900 border border-gray-800 focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all duration-200"
                        required
                      />
                    </div>
                  </label>

                  <label className="block">
                    <span className="text-gray-400">Time</span>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                      <input
                        type="time"
                        name="time"
                        value={formData.time}
                        onChange={handleInputChange}
                        className="mt-1 block w-full pl-10 rounded-lg bg-gray-900 border border-gray-800 focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all duration-200"
                        required
                      />
                    </div>
                  </label>
                </div>

                <div className="space-y-4">
                  <label className="block">
                    <span className="text-gray-400">Venue</span>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                      <input
                        type="text"
                        name="venue"
                        value={formData.venue}
                        onChange={handleInputChange}
                        className="mt-1 block w-full pl-10 rounded-lg bg-gray-900 border border-gray-800 focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all duration-200"
                        required
                      />
                    </div>
                  </label>

                  <label className="block">
                    <span className="text-gray-400">Capacity</span>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                      <input
                        type="number"
                        name="capacity"
                        value={formData.capacity}
                        onChange={handleInputChange}
                        min="1"
                        className="mt-1 block w-full pl-10 rounded-lg bg-gray-900 border border-gray-800 focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all duration-200"
                        required
                      />
                    </div>
                  </label>

                  <label className="block">
                    <span className="text-gray-400">Price (ETH)</span>
                    <div className="relative">
                      <Coins className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        min="0"
                        step="0.001"
                        className="mt-1 block w-full pl-10 rounded-lg bg-gray-900 border border-gray-800 focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all duration-200"
                        required
                      />
                    </div>
                  </label>

                  <label className="block">
                    <span className="text-gray-400">Category</span>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-lg bg-gray-900 border border-gray-800 focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all duration-200"
                      required
                    >
                      <option value="">Select category</option>
                      <option value="Concert">Concert</option>
                      <option value="Sports">Sports</option>
                      <option value="Music">Music</option>
                      <option value="Drama">Drama</option>
                      <option value="Others">Others</option>
                    </select>
                  </label>

                  <label className="block">
                    <span className="text-gray-400">Event Logo</span>
                    <div className="mt-1">
                      <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-800 border-dashed rounded-lg hover:border-violet-500/50 transition-all duration-200">
                        <div className="space-y-1 text-center">
                          <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                          <div className="flex text-sm text-gray-400">
                            <label className="relative cursor-pointer rounded-md font-medium text-violet-500 hover:text-violet-400 focus-within:outline-none">
                              <span>Upload a file</span>
                              <input
                                type="file"
                                name="logo"
                                className="sr-only"
                                accept="image/*"
                                onChange={handleInputChange}
                                required
                              />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                          </div>
                          <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                        </div>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {(status.txHash || status.error || status.successMessage) && (
                <div className="border-t border-gray-800 p-6">
                  {status.txHash && (
                    <div className="flex items-center text-sm text-gray-400 mb-2">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      <a
                        href={`https://block-explorer.testnet.lens.dev/tx/${status.txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-violet-500 hover:text-violet-400"
                      >
                        View transaction
                      </a>
                    </div>
                  )}
                  
                  {status.successMessage && (
                    <div className="flex items-center text-sm text-green-500 mb-2">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      {status.successMessage}
                    </div>
                  )}

                  {status.error && (
                    <div className="flex items-center text-sm text-red-500">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      {status.error}
                    </div>
                  )}
                </div>
              )}

              <div className="border-t border-gray-800 p-6">
                <div className="flex justify-end gap-4">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => navigate('/events')}
                    className="border border-violet-500/20 hover:border-violet-500/50"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={!status.isStaked || status.isSubmitting || status.isUploading}
                    className="relative group"
                  >
                    {(status.isSubmitting || status.isUploading) ? (
                      <span className="flex items-center">
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        {status.isUploading ? 'Uploading...' : 'Creating Event...'}
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <Upload className="w-4 h-4 mr-2 group-hover:translate-y-px transition-transform" />
                        Create Event
                      </span>
                    )}
                  </Button>
                </div>
              </div>
            </Card>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default EventForm;