import { Routes, Route, useLocation } from 'react-router-dom'
import { UserProfileProvider } from './context/UserProfileContext'
import { FiltersProvider } from './context/FiltersContext'
import { HealthProfileProvider } from './context/HealthProfileContext'
import { HealthFiltersProvider } from './context/HealthFiltersContext'
import Header from './components/Header'
import TravelHeader from './components/travel/TravelHeader'
import Footer from './components/Footer'
import Home from './pages/Home'
import Calculators from './pages/Calculators'
import Login from './pages/Login'
import LeadLanding, { type LandingSlug } from './components/LeadLanding'
import TravelQuotesPage from './pages/TravelQuotesPage'
import TravelCheckoutPage from './pages/TravelCheckoutPage'
import TravelReviewPage from './pages/TravelReviewPage'
import TravelPaymentPage from './pages/TravelPaymentPage'
import QuotesPage from './pages/QuotesPage'
import PlanDetailPage from './pages/PlanDetailPage'
import HealthLandingPage from './pages/HealthLandingPage'
import SelectAgePage from './pages/SelectAgePage'
import SelectCityPage from './pages/SelectCityPage'
import HealthQuotesPage from './pages/HealthQuotesPage'
import FamilyHealthInsurancePage from './pages/FamilyHealthInsurancePage'
import ClaimSupportPage from './pages/ClaimSupportPage'
import HelpPage from './pages/HelpPage'
import DiscountsPage from './pages/DiscountsPage'
import HealthProductDetailPage from './pages/HealthProductDetailPage'
import HealthProposalPage from './pages/HealthProposalPage'
import HealthCheckoutPage from './pages/HealthCheckoutPage'
import InvestmentLeadPage from './pages/InvestmentLeadPage'
import InvestmentQuotesPage from './pages/InvestmentQuotesPage'
import InvestmentProposalPage from './pages/InvestmentProposalPage'
import InvestmentReviewPage from './pages/InvestmentReviewPage'
import InvestmentPaymentPage from './pages/InvestmentPaymentPage'
import GuaranteedReturnPlansPage from './pages/GuaranteedReturnPlansPage'
import CarInsurance from './pages/CarInsurance'
import CarQuotesPage from './pages/CarQuotesPage'
import CarSummaryPage from './pages/CarSummaryPage'
import CarPaymentPage from './pages/CarPaymentPage'
import BikeInsurance from './pages/BikeInsurance'
import BikeLoadingPage from './pages/BikeLoadingPage'
import BikeQuotesPage from './pages/BikeQuotesPage'
import BikeProposalPage from './pages/BikeProposalPage'
import BikePaymentPage from './pages/BikePaymentPage'
import TermCheckoutPage from './pages/TermCheckoutPage'
import TermPaymentPage from './pages/TermPaymentPage'
import TermWomenFlow from './pages/TermWomenFlow'
import GuaranteedReturnDetailsPage from './pages/GuaranteedReturnDetailsPage'
import GuaranteedReturnReviewPage from './pages/GuaranteedReturnReviewPage'
import GuaranteedReturnPaymentPage from './pages/GuaranteedReturnPaymentPage'
import ChildSavingsPlanListPage from './pages/ChildSavingsPlanListPage'
import ChildSavingsDetailsPage from './pages/ChildSavingsDetailsPage'
import ChildSavingsReviewPage from './pages/ChildSavingsReviewPage'
import ChildSavingsPaymentPage from './pages/ChildSavingsPaymentPage'
import RetirementPlansResultsPage from './pages/RetirementPlansResultsPage'
import RetirementPlanDetailsPage from './pages/RetirementPlanDetailsPage'
import RetirementPlanReviewPage from './pages/RetirementPlanReviewPage'
import RetirementPlanPaymentPage from './pages/RetirementPlanPaymentPage'
import EmployeeGroupHealthInsurancePage from './pages/EmployeeGroupHealthInsurancePage'
import EmployeeGroupHealthPlansPage from './pages/EmployeeGroupHealthPlansPage'
import EmployeeGroupHealthThanksPage from './pages/EmployeeGroupHealthThanksPage'
import { EmployeeCoverProvider } from './context/EmployeeCoverContext'
import BuildingValuePage from './pages/BuildingValuePage'
import HomeInsuranceLeadForm from './components/home-insurance/HomeInsuranceLeadForm'
import HomePlanListPage from './pages/HomePlanListPage'
import OwnerDetailsPage from './pages/OwnerDetailsPage'
import PropertyAddressPage from './pages/PropertyAddressPage'
import ReviewPayPage from './pages/ReviewPayPage'
import SipCalculatorPage from './pages/SipCalculatorPage'
import IncomeTaxCalculatorPage from './pages/IncomeTaxCalculatorPage'
import CibilReportPage from './pages/CibilReportPage'
import EquifaxReportPage from './pages/EquifaxReportPage'
import CrifReportPage from './pages/CrifReportPage'
import CreditScoreInfoPage from './pages/CreditScoreInfoPage'
import CreditScoreArticlesPage from './pages/CreditScoreArticlesPage'
import CibilCrossVerifyPage from './components/CibilAnalysisVerificationPage'
import CibilAnalysisSuccessPage from './components/CibilAnalysisSuccessPage'
import CreditScoreArticleDetailPage from './pages/CreditScoreArticleDetailPage'
import CibilScoreLoanPage from './pages/CibilScoreLoanPage'
import CibilLoanEligibilityPage from './pages/CibilLoanEligibilityPage'
import CibilScoreForPersonalLoanPage from './pages/CibilScoreForPersonalLoanPage'
import CibilScoreResultPage from './pages/CibilScoreResultPage'
import LoanOffersPage from './pages/LoanOffersPage'
import WalletPage from './pages/WalletPage'
import AddMoneyPage from './pages/AddMoneyPage'
import PaymentStatusPage from './pages/PaymentStatusPage'
import { AuthProvider } from './context/AuthContext'   // add near the other context imports
import { WalletProvider } from './context/WalletContext'
import { ToastProvider } from './context/ToastContext'
const leadRoute = (slug: LandingSlug) => <LeadLanding slug={slug} />

export default function App() {
  const location = useLocation()
  const isCustomFlow =
    location.pathname.startsWith('/health-insurance') ||
    location.pathname.startsWith('/investment-plans') ||
    location.pathname.startsWith('/car-insurance') ||
    location.pathname.startsWith('/bike-insurance')
  const hideHomeHeader =
    location.pathname.startsWith('/term-insurance-women') ||
    location.pathname.startsWith('/home-insurance') ||
    location.pathname.startsWith('/sip-calculator') ||
    location.pathname.startsWith('/income-tax-calculator') ||
    location.pathname.match(/^\/guaranteed-return-plans\/(plans|details|review|payment)/) ||
    location.pathname.match(/^\/child-savings-plans\/(plans|details|review|payment)/) ||
    location.pathname.match(/^\/retirement-plans\/(plans|details|review|payment)/) ||
    location.pathname.match(/^\/employee-group-health-insurance\/(plans|thanks)/)
  const isTermPayment = /^\/quotes\/plan\/[^/]+\/payment$/.test(location.pathname)
  // const hideHomeHeader = location.pathname.startsWith('/term-insurance-women')

  return (
    <AuthProvider>
    <WalletProvider>
    <ToastProvider>
    <UserProfileProvider>
      <FiltersProvider>
        <HealthProfileProvider>
          <HealthFiltersProvider>
            <div className="flex min-h-screen flex-col">
              {(() => {
                const isTravelFlow = location.pathname.startsWith('/travel-insurance')
                const hasOwnHeader = ['/travel-insurance/payment', '/travel-insurance/review'].some((p) =>
                  location.pathname.startsWith(p)
                )
                if (hasOwnHeader || isTermPayment) return null
                if (isTravelFlow) return <TravelHeader />
                return !isCustomFlow && !hideHomeHeader && <Header />
              })()}
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/term-insurance" element={leadRoute('term')} />
                  <Route path="/car-insurance" element={<CarInsurance />} />
                  <Route path="/car-insurance/quotes" element={<CarQuotesPage />} />
                  <Route path="/car-insurance/summary" element={<CarSummaryPage />} />
                  <Route path="/car-insurance/payment" element={<CarPaymentPage />} />
                  <Route path="/bike-insurance" element={<BikeInsurance />} />
                  <Route path="/bike-insurance/loading" element={<BikeLoadingPage />} />
                  <Route path="/bike-insurance/quotes" element={<BikeQuotesPage />} />
                  <Route path="/bike-insurance/proposal" element={<BikeProposalPage />} />
                  <Route path="/bike-insurance/redirecting" element={<BikeLoadingPage redirecting />} />
                  <Route path="/bike-insurance/payment" element={<BikePaymentPage />} />
                  <Route path="/travel-insurance" element={leadRoute('travel')} />
                  <Route path="/travel-insurance/quotes" element={<TravelQuotesPage />} />
                  <Route path="/travel-insurance/checkout" element={<TravelCheckoutPage />} />
                  <Route path="/travel-insurance/review" element={<TravelReviewPage />} />
                  <Route path="/travel-insurance/payment" element={<TravelPaymentPage />} />
                  <Route path="/investment-plans" element={<InvestmentLeadPage />} />
                  <Route path="/investment-plans/quotes" element={<InvestmentQuotesPage />} />
                  <Route path="/investment-plans/proposal" element={<InvestmentProposalPage />} />
                  <Route path="/investment-plans/review" element={<InvestmentReviewPage />} />
                  <Route path="/investment-plans/payment" element={<InvestmentPaymentPage />} />
                  <Route path="/calculators" element={<Calculators />} />
                  <Route path="/cibil-report" element={<CibilReportPage />} />
                  <Route path="/equifax-report" element={<EquifaxReportPage />} />
                  <Route path="/crif-report" element={<CrifReportPage />} />
                  <Route path="/cibil-score-by-pan" element={<CreditScoreInfoPage kind="pan" />} />
                  <Route path="/cibil-score-by-pan/score" element={<CibilScoreResultPage />} />
                  <Route path="/increase-cibil-score" element={<CreditScoreInfoPage kind="improve" />} />
                  <Route path="/increase-cibil-score/verify" element={<CibilCrossVerifyPage />} />
                  <Route path="/increase-cibil-score/success" element={<CibilAnalysisSuccessPage />} />
                  <Route path="/cibil-score-loan" element={<CibilScoreLoanPage />} />
                  <Route path="/cibil-score-loan/eligible" element={<CibilLoanEligibilityPage />} />
                  <Route path="/loan-offers" element={<LoanOffersPage />} />
                  <Route path="/wallet" element={<WalletPage />} />
                  <Route path="/wallet/add-money" element={<AddMoneyPage />} />
                  <Route path="/wallet/payment-status" element={<PaymentStatusPage />} />
                  <Route path="/cibil-score-for-personal-loan" element={<CibilScoreForPersonalLoanPage />} />
                  <Route path="/category/credit-score" element={<CreditScoreArticlesPage />} />
                  <Route path="/category/credit-score/:slug" element={<CreditScoreArticleDetailPage />} />
                  <Route path="/sip-calculator" element={<SipCalculatorPage />} />
                  <Route path="/income-tax-calculator" element={<IncomeTaxCalculatorPage />} />
                  <Route path="/quotes/plan/:planId" element={<PlanDetailPage />} />
<Route path="/quotes/plan/:planId/checkout" element={<TermCheckoutPage />} />
<Route path="/quotes/plan/:planId/payment" element={<TermPaymentPage />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/family-health-insurance" element={<FamilyHealthInsurancePage />} />
                  <Route path="/term-return-of-premium" element={leadRoute('term-rop')} />
                  <Route path="/guaranteed-return-plans" element={leadRoute('guaranteed-return')} />
                  <Route path="/guaranteed-return-plans/plans" element={<GuaranteedReturnPlansPage />} />
                  <Route path="/guaranteed-return-plans/details" element={<GuaranteedReturnDetailsPage />} />
                  <Route path="/guaranteed-return-plans/review" element={<GuaranteedReturnReviewPage />} />
                  <Route path="/guaranteed-return-plans/payment" element={<GuaranteedReturnPaymentPage />} />
                  <Route path="/child-savings-plans" element={leadRoute('child-savings')} />
                  <Route path="/child-savings-plans/plans" element={<ChildSavingsPlanListPage />} />
                  <Route path="/child-savings-plans/details" element={<ChildSavingsDetailsPage />} />
                  <Route path="/child-savings-plans/review" element={<ChildSavingsReviewPage />} />
                  <Route path="/child-savings-plans/payment" element={<ChildSavingsPaymentPage />} />
                  <Route path="/retirement-plans" element={leadRoute('retirement')} />
                  <Route path="/retirement-plans/plans" element={<RetirementPlansResultsPage />} />
                  <Route path="/retirement-plans/details" element={<RetirementPlanDetailsPage />} />
                  <Route path="/retirement-plans/review" element={<RetirementPlanReviewPage />} />
                  <Route path="/retirement-plans/payment" element={<RetirementPlanPaymentPage />} />
                  <Route path="/employee-group-health-insurance" element={
                    <EmployeeCoverProvider>
                      <EmployeeGroupHealthInsurancePage />
                    </EmployeeCoverProvider>
                  }/>
                  <Route path="/employee-group-health-insurance/plans" element={<EmployeeGroupHealthPlansPage />} />
                  <Route path="/employee-group-health-insurance/thanks" element={<EmployeeGroupHealthThanksPage />} />
                  <Route path="/home-insurance" element={<HomeInsuranceLeadForm />} />
                  <Route path="/home-insurance/building-value" element={<BuildingValuePage />} />
                  <Route path="/home-insurance/plan-list" element={<HomePlanListPage />} />
                  <Route path="/home-insurance/owner-details" element={<OwnerDetailsPage />} />
                  <Route path="/home-insurance/property-address" element={<PropertyAddressPage />} />
                  <Route path="/home-insurance/review-pay" element={<ReviewPayPage />} />
                  <Route path="/quotes" element={<QuotesPage />} />
                  <Route path="/quotes/plan/:planId" element={<PlanDetailPage />} />
                  {/* Health Insurance journey */}
                  <Route path="/health-insurance" element={<HealthLandingPage />} />
                  <Route path="/health-insurance/age" element={<SelectAgePage />} />
                  <Route path="/health-insurance/city" element={<SelectCityPage />} />
                  <Route path="/health-insurance/quotes" element={<HealthQuotesPage />} />
                  <Route path="/health-insurance/product-detail" element={<HealthProductDetailPage />} />
                  <Route path="/health-insurance/proposal" element={<HealthProposalPage />} />
                  <Route path="/health-insurance/checkout" element={<HealthCheckoutPage />} />
                  <Route path="/health-insurance/claim-support" element={<ClaimSupportPage />} />
                  <Route path="/health-insurance/help" element={<HelpPage />} />
                  <Route path="/health-insurance/discounts" element={<DiscountsPage />} />
                  <Route path="/term-insurance-women/*" element={<TermWomenFlow />} />
                </Routes>
              </main>
              {!isCustomFlow && !isTermPayment && !location.pathname.startsWith('/sip-calculator') && !location.pathname.startsWith('/income-tax-calculator') && !location.pathname.match(/^\/guaranteed-return-plans\/(details|review|payment)/) && !location.pathname.match(/^\/child-savings-plans\/(details|review|payment)/) && !location.pathname.match(/^\/retirement-plans\/(details|review|payment)/) && !location.pathname.match(/^\/employee-group-health-insurance\/(plans|thanks)/) && <Footer />}
            </div>
          </HealthFiltersProvider>
        </HealthProfileProvider>
      </FiltersProvider>
    </UserProfileProvider>
    </ToastProvider>
    </WalletProvider>
    </AuthProvider>
  )
}
