import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/home/home'
import Card from './pages/card/card'
import Login from './pages/login/login'
import Signup from './pages/signup/signup'
import ForgottenPassword from './pages/forgottenPass/forgottenPassword'
import Dashboard from './pages/dashboard/dashboard'
import Utility from './pages/utilities/utility'
import UpdatePassword from './pages/updatePassword/updatePassword'
import History from './pages/history/history'
import Personal from './pages/personal/personal'
import Profile from './pages/profile/profile'

import Us from './pages/us/us'
import Bank from './pages/banks/bank'
import Deposit from './pages/deposit/deposit'
import SingleHistory from './pages/history/transactionDetails'
import TransactionDetails from './pages/history/transactionDetails'
import AdminDashboard from './pages/dashboard/adminDashboard'
import Finance from './pages/finance/finance'
import BtcDeposit from './pages/btc/btcDeposit'
import BtcWithdraw from './pages/btc/btcWithdraw'
import BtcPurchase from './pages/btc/btcPurchase'
import Loan from './pages/loan/loan'
import CreatePin from './components/modal/createPinModal'
import PayUtility from './pages/utilities/payUtility'


const App = () => {
  return (
    <div>
      
      <Routes>
        <Route index path='/' element={<Home/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/signup' element={<Signup/>}/>
        <Route path='/forgottenPassword' element={<ForgottenPassword/>}/>
        <Route path='/update-password/:id/:token' element={<UpdatePassword/>}/>
        <Route path='/dashboard' element={<Dashboard/>}/>
        <Route path='/history' element={<History/>}/>
        <Route path='/personal' element={<Personal/>}/>
        <Route path='/loan' element={<Loan/>}/>
        <Route path='/utility' element={<Utility/>}/>
        <Route path='/card' element={<Card/>}/>
        <Route path='/profile' element={<Profile/>}/>
        <Route path='/us' element={<Us/>}/>
        <Route path='/banks' element={<Bank/>}/>
        <Route path='/deposit' element={<Deposit/>}/>
        <Route path='/transactions/:id' element={<TransactionDetails/>}/>
        <Route path="/external-transaction/:id" element={<TransactionDetails />} />
        <Route path='/admin-dashboard' element={<AdminDashboard/>}/>
        <Route path='/finance' element={<Finance/>}/>
        <Route path='/deposits' element={<BtcDeposit/>}/>
        <Route path='/withdraw' element={<BtcWithdraw/>}/>
        <Route path='/btc-purchase' element={<BtcPurchase/>}/>
        <Route path='/pay-utility' element={<PayUtility/>}/>
        
      </Routes>
    </div>
  )
}

export default App
