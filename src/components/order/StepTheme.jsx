import { themes } from '../../data/options'
import ThemeArt from '../ThemeArt'
import OptionCard from './OptionCard'
import StepTitle from './StepTitle'

export default function StepTheme({ order, set, advance, errors }) {
  return (
    <div className="step">
      <StepTitle title="Choisissez le thème" hint="Touchez un thème pour passer à l’étape suivante." error={errors.theme} />
      <div className="options options--themes" role="radiogroup" aria-label="Thème">
        {themes.map((theme) => (
          <OptionCard
            key={theme.id}
            className="option--theme"
            checked={order.theme === theme.id}
            onSelect={() => {
              set('theme', theme.id)
              advance()
            }}
            art={<ThemeArt theme={theme} />}
            title={theme.label}
          />
        ))}
      </div>
    </div>
  )
}
