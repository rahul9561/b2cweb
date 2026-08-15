import { CheckCircle2 } from 'lucide-react'
import EmployeeCoverWizard from '../components/EmployeeCoverWizard'

export default function EmployeeGroupHealthInsurancePage() {
  return (
    <section className="bg-blueBG">
      <div className="container-pb grid gap-8 py-12 lg:grid-cols-[1.2fr_.8fr] lg:items-start">
        <div>
          <p className="text-[12px] font-semibold text-brand">
            AV Management <span className="text-slate2-secondary">for Business</span>
          </p>
          <h1 className="mt-4 text-[38px] font-medium leading-tight text-navy">
            Compare and save <span className="font-bold text-brand">on group health cover</span>
          </h1>
          <div className="mt-6 space-y-3">
            {['Straightforward claims support', 'Plans for varied team sizes', 'Practical administration tools'].map(
              (x) => (
                <p key={x} className="flex items-center gap-2 text-[13px] text-navy">
                  <CheckCircle2 size={18} className="text-brand" />
                  {x}
                </p>
              )
            )}
          </div>
        </div>
        <div>
          <EmployeeCoverWizard />
        </div>
      </div>
    </section>
  )
}