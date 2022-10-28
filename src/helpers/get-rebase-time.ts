import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { IReduxState } from "../store/slices/state.interface";
import { EvokiContract } from 'src/abi';
import { ethers } from 'ethers';
import { Networks } from 'src/constants';
import { getAddresses } from 'src/constants';
import { loadAppDetails } from 'src/store/slices/app-slice';
import { useAddress, useWeb3Context } from 'src/hooks';
import { loadAccountDetails } from 'src/store/slices/account-slice';

export async function getLastRebasedTime(networkID: Networks, provider: ethers.Signer | ethers.providers.Provider): Promise<number> {
    
    const addresses = getAddresses(networkID);
    const evokiContract = new ethers.Contract( addresses.EVOKI_ADDRESS, EvokiContract, provider);
    const lastRebasedTime = await evokiContract._lastRebasedTime();
    return lastRebasedTime;
}

const useCountdown = () => {

    const dispatch = useDispatch();
    const { chainID , provider } = useWeb3Context();
    const address = useAddress();
    const lastRebasedTime = useSelector<IReduxState, number>(state => {
        return state.app.lastRebasedTime;
    });
    const [ countDown, setCountDown ] = useState<number>(600000);
    
    useEffect(() => {      
        const interval = setInterval(() => {
            setCountDown( 6 * Math.pow(10,5) - ( Date.now() - lastRebasedTime) % (6 * Math.pow(10,5)));
            if (countDown <= 1000){
                dispatch(loadAppDetails({ networkID : chainID, provider: provider}));
                // console.log("load app");
                if(address != "") {
                    dispatch(loadAccountDetails({ networkID: chainID, address, provider: provider}));
                    // console.log("load account");
                }
            } 
        }, 1000);

        return () => {
            clearInterval(interval);
        }
    }, [countDown]);
    return getReturnValues(countDown);
};

const getReturnValues = (countDown:number) => {
  // calculate time left
  const days = Math.floor(countDown / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (countDown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  let minutes = String(Math.floor((countDown % (1000 * 60 * 60)) / (1000 * 60)));
  if ( Number(minutes) < 10 ) {
      minutes = `0${minutes}`;
  }
  let seconds = String(Math.floor((countDown % (1000 * 60)) / 1000));
  if ( Number(seconds) < 10 ) {
      seconds = `0${seconds}`;
  }

  return [days, hours, minutes, seconds];
};

export { useCountdown };