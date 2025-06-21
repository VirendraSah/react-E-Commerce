import Header from '../Components/Common/Header'
import Footer from '../Components/Common/Footer'

function DashboardLayout({children}) {
  return (
    <>
        <Header/>
        {children}
        <Footer/>
    </>
  )
}

export default DashboardLayout