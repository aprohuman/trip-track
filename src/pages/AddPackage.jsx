import React, { useState, } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Header from '../components/Header';
import Sidebar from '../components/formFiledsets/Sidebar';
import PackageForm from '../components/PackageForm';
import  { setPackageName } from "../redux";
import store from "../redux/store";

export default function TripDetailFomPage(){
  const [packages, setPackages] = useState(['001']);
  const [selectedPackage, setSelectedPackage] = useState('001');

  const [stepsCompleted, setStepsCompleted] = useState({
    'Package Description': false,
    'Duration': false,
    'Trip Details': false,
    'Trip Breakdown': false,
    'Passenger count and pricing': false,
    'Media Upload': false,
  });

  const dispatch = useDispatch();
  const state = useSelector((state)=>state);


  return (
    <div className="flex flex-col fixed border-2 w-full">
      <Header />
        <div className="flex flex-col bg-[#CFDAF0] gap-2 md:flex-row">
          <Sidebar
            packages={packages}
            setPackages={setPackages}
            selectedPackage={selectedPackage}
            setSelectedPackage={setSelectedPackage}
            stepsCompleted={stepsCompleted}
          />
          <div className="h-[90vh] flex-[0_1_80%]">
              <h2 className="py-6 px-1 text-[1.1rem] font-[500]">
                {`Fill Out Below Package No. #${selectedPackage} Details :`}
              </h2>
              <div className='h-[82vh] overflow-y-auto'>
                <PackageForm setStepsCompleted={setStepsCompleted} />
              </div>
          </div>
        </div>
    </div>
  )
}
