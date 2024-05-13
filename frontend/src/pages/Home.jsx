import React, { useEffect, useState } from 'react';
import brandImg from '../assets/brand-img.png';
import brandName from '../assets/brand-name.png';
import user from '../assets/user-icon.png';
import logo from '../assets/logo.png';
import status from '../assets/status.png';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const navigate = useNavigate();
  const [registrations, setRegistrations] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState({});

  useEffect(() => {
    axios.get('http://localhost:8080/api/')
      .then(res => {
        console.log(res.data);
        setRegistrations(res.data);
        // Initialize selectedOptions state based on registration status
        const initialSelectedOptions = {};

        res.data.forEach(registration => {
          initialSelectedOptions[registration._id] = registration.status;
        });
        console.log(initialSelectedOptions)
        setSelectedOptions(initialSelectedOptions);
      })
      .catch(err => {
        console.log(err);
        // navigate('/login');
      });
  }, [navigate]);

  const handleChangeStatus = async (id, e) => {
    const newStatus = e.target.value;
    setSelectedOptions(prevState => ({
      ...prevState,
      [id]: newStatus
    }));
    try {
      await axios.post('http://localhost:8080/api/update-status/', { id, status: newStatus });
      // Refresh registrations after updating status
      const res = await axios.get('http://localhost:8080/api/');
      setRegistrations(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <section>
      <div className="navbar flex justify-between items-center bg-custom-201A31 text-white h-24 px-20">
        <div className="brand-image flex justify-center items-center">
          <img src={brandImg} alt="Brand Logo" className="w-16 h-16" />
          <img src={brandName} alt="Brand Name" className="w-32 h-7" />
        </div>
        <div className="welcome">
          <h1 className="text-[42px] font-bold" style={{ fontFamily: 'Inter', fontSize: '36px', fontWeight: 600 }}>WELCOME</h1>
        </div>
        <div className="flex items-center gap-2 justify-center">
          <img src={user} alt="User Logo" className="w-8 h-auto mr-2" />
          <p className="mr-4">Alex Robinson</p>
          <button className="bg-black text-white  px-4 py-1.5 rounded-md">Log out</button>
        </div>
      </div>

      <div className="subNavbar  flex justify-between items-center  h-24 mx-24 py-4">
        <img src={status} alt="Brand Logo" className="w-16 " />
        <h1 className="text-pink-600 text-4xl font-thin  mr-24" style={{ fontFamily: 'Poppins', color: '#E8246F' }}>Sicu-aura Board</h1>
        <img src={logo} alt="User Logo" className="w-8 h-" />
      </div>

      <div>
        {registrations.length === 0 ? (
          <div className="no-customer">
            <h4>No registrations found</h4>
          </div>
        ) : (
          <div className="table-container overflow-x-scroll">
            <table className="table">
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Date & Time</th>
                  <th>Name</th>
                  <th>Photo</th>
                  <th>Email</th>
                  <th>Phone No.</th>
                  <th>Address</th>
                  <th>IMEI Number 1*</th>
                  <th>IMEI Number 2</th>
                  <th>Govt ID Proof</th>
                  <th>Live Location</th>
                  <th>Victim Type</th>
                  <th>Emergency Type</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {registrations.map(registration => (
                //   <tr className={`${
                //     registration.status === 'Pending' ? 'bg-red-500' : 
                //     registration.status === 'On its way' ? 'bg-yellow-500' : 
                //     'bg-green-500'
                // }`}>
                <tr >
                  <td>{registration.id}</td>
                    <td>{registration.dateTime}</td>
                    <td>{registration.name}</td>
                    <td>
                      <img className="h-10 w-14" src={registration.photo} alt={registration.name} />
                    </td>
                    <td>{registration.email}</td>
                    <td>{registration.phno}</td>
                    <td>{registration.address}</td>
                    <td>{registration.imeino1}</td>
                    <td>{registration.imeino2}</td>
                    <td>{registration.govtid}</td>
                    <td>{registration.liveLocation}</td>
                    <td>{registration.victimtype}</td>
                    <td>{registration.emergencytype}</td>
                    <td>
                      <select
                        value={selectedOptions[registration._id] || registration.status}
                        onChange={(e) => handleChangeStatus(registration._id, e)}
                        className={`px-2 ${registration.status === 'Pending' ? 'button-pending' : registration.status === 'On its way' ? 'button-on-the-way' : 'button-done'}`}
                      >
                        <option  className='bg-red-500'  value="Pending">Pending</option>
                        <option  className='bg-yellow-500' value="On its way">On its way</option>
                        <option  className='bg-green-500' value="Delivered">Delivered</option>
                      </select>
                    </td>
                  </tr>
                ))}
                {/* Add blank rows here */}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
};

export default Home;
