import React, { useEffect, useState, useRef } from 'react';
import brandImg from '../assets/brand-img.png';
import brandName from '../assets/brand-name.png';
import user from '../assets/user-icon.png';
import logo from '../assets/mlogo.svg';
import backgroundCover from '../assets/brand-logo-background.png';
import pendingLogo from '../assets/wait-logo.png';
import arrowLogo from '../assets/arrow-logo.png';
import onTheWayLogo from '../assets/on-way-logo.png';
import doneLogo from '../assets/done-logo.png';
import status from '../assets/status.png';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from "./AuthContext";


const Home = () => {
  const navigate = useNavigate();
  const [registrations, setRegistrations] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [openDropdownId, setOpenDropdownId] = useState(null); 
  const dropdownRefs = useRef({}); 
  const auth = useAuth(); 

  useEffect(() => {
    axios.get('http://localhost:1338/api/')
      .then(res => {
        // console.log(res.data);
        setRegistrations(res.data);
        // Initialize selectedOptions state based on registration status
        const initialSelectedOptions = {};

        res.data.forEach(registration => {
          initialSelectedOptions[registration._id] = registration.status;
        });

        setSelectedOptions(initialSelectedOptions);
      })
      .catch(err => {
        console.log(err);
        // navigate('/login');
      });

    // Event listener to handle clicks outside the dropdown
    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      // Clean up event listener
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [navigate]);

  // Function to handle clicks outside the dropdown
  const handleOutsideClick = (e) => {
    if (Object.values(dropdownRefs.current).every(ref => ref && !ref.contains(e.target))) {
      setOpenDropdownId(null);
    }
  };

  // Function to toggle dropdown
  const toggleDropdown = (id) => {
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  const handleChangeStatus = async (id, newStatus) => {

    console.log(id, newStatus)
    setSelectedOptions(prevState => ({
      ...prevState,
      [id]: newStatus
    }));
    try {
      await axios.post('http://localhost:1338/api/update-status/', { id, status: newStatus });
      // Refresh registrations after updating status
      const res = await axios.get('http://localhost:1338/api/');
      setRegistrations(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handlelogout=()=>{

    auth.logout();
    navigate("/login");

  }
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
          <button className="bg-black text-white  px-4 py-1.5 rounded-md" onClick={handlelogout}>Log out</button>
        </div>
      </div>

      <div className="subNavbar  flex justify-between items-center  h-24 mx-24 py-4">
        <img src={status} alt="Brand Logo" className="h-16 " />
        <h1 className="text-pink-600 text-4xl font-thin  mr-20" style={{ fontFamily: 'Poppins', color: '#E8246F' }}>Sicu-aura Board</h1>
        <img src={logo} alt="User Logo" className=" h-16" />
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
              
              <tbody className='relative bg-slate-400'>
                <img src={backgroundCover} alt="cover home" className="absolute inset-0 object-cover mx-auto" />
                {registrations.map(registration => (
             <tr key={registration.id} className={`${selectedOptions[registration._id] === 'On its way' ? 'bg-yellow-300' : selectedOptions[registration._id] === 'Delivered' ? 'bg-green-400' : 'bg-white'}`}>
             <td >{registration.id}</td>
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
                      <div className='relative' onClick={() => toggleDropdown(registration._id)} ref={ref => dropdownRefs.current[registration._id] = ref}>

                    {

                      <article className={`flex justify-between gap-x-2 flex-row items-center rounded-full py-1.5 px-3 ${selectedOptions[registration._id] === 'Pending' ? 'bg-red-500' : selectedOptions[registration._id] === 'On its way' ? 'bg-yellow-400' : selectedOptions[registration._id] === 'Delivered' ? 'bg-green-500' : ''} shadow-md`} >
                      <div className="h-4 w-4">
                        <img src={selectedOptions[registration._id] === 'Pending' ? pendingLogo : selectedOptions[registration._id] === 'On its way' ? onTheWayLogo : selectedOptions[registration._id] === 'Delivered' ? doneLogo : ''} alt="Status Icon" />
                      </div>
                      <div>{selectedOptions[registration._id] || registration.status}</div>
                      <div>
                        <div className="h-4 w-4">
                          <img src={arrowLogo} alt="Arrow Icon" className="h-4 w-4" />
                        </div>
                      </div>
                      </article>

                    }
                        {openDropdownId === registration._id && (
                          <section className='absolute top-full  left-0 flex flex-col gap-y-1 bg-white rounded-lg  shadow-md p-2 z-10'>
                            <div className='flex justify-center'><img src={arrowLogo} alt="arr" /></div>
                            {/* Dropdown options */}
                            <article className="flex justify-between gap-x-2 flex-row items-center rounded-full py-1.5 px-3 bg-red-500" onClick={() => handleChangeStatus(registration._id, 'Pending')}>
                              <div className="h-4 w-4">
                                <img src={pendingLogo} alt="Pending Icon" />
                              </div>
                              <div>Pending</div>
                              <div>
                                <div className="h-4 w-4">
                                  <img src={arrowLogo} alt="Arrow Icon" className="h-4 w-4" />
                                </div>
                              </div>
                            </article>
                            <article className="flex justify-between gap-x-2 flex-row items-center rounded-full py-1.5 px-3 bg-yellow-400" onClick={() => handleChangeStatus(registration._id, 'On its way')}>
                              <div className="h-4 w-4">
                                <img src={pendingLogo} alt="Pending Icon" />
                              </div>
                              <div>On its way</div>
                              <div>
                                <div className="h-4 w-4">
                                  <img src={arrowLogo} alt="Arrow Icon" className="h-4 w-4" />
                                </div>
                              </div>
                            </article>
                            <article className="flex justify-between gap-x-2 flex-row items-center rounded-full py-1.5 px-3 bg-green-500" onClick={() => handleChangeStatus(registration._id, 'Delivered')}>
                              <div className="h-4 w-4">
                                <img src={pendingLogo} alt="Pending Icon" />
                              </div>
                              <div>Delivered</div>
                              <div>
                                <div className="h-4 w-4">
                                  <img src={arrowLogo} alt="Arrow Icon" className="h-4 w-4" />
                                </div>
                              </div>
                            </article>
                          </section>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              {Array.from({ length: 14 }).map((_, index) => (
                  <tr key={index} className={`h-10 text-center ${index % 2 === 0 ? 'bg-gray-200' : 'bg-gray-50'}`}>
                    <td colSpan="15" className="py-2"></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
};

export default Home;
