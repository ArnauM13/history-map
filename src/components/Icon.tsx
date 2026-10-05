import arrowBack from '@material-symbols/svg-400/outlined/arrow_back.svg?raw'
import calendarMonth from '@material-symbols/svg-400/outlined/calendar_month.svg?raw'
import chevronLeft from '@material-symbols/svg-400/outlined/chevron_left.svg?raw'
import chevronRight from '@material-symbols/svg-400/outlined/chevron_right.svg?raw'
import close from '@material-symbols/svg-400/outlined/close.svg?raw'
import experiment from '@material-symbols/svg-400/outlined/experiment.svg?raw'
import fence from '@material-symbols/svg-400/outlined/fence.svg?raw'
import flagFill from '@material-symbols/svg-400/outlined/flag-fill.svg?raw'
import flag from '@material-symbols/svg-400/outlined/flag.svg?raw'
import history from '@material-symbols/svg-400/outlined/history.svg?raw'
import historyEdu from '@material-symbols/svg-400/outlined/history_edu.svg?raw'
import layersFill from '@material-symbols/svg-400/outlined/layers-fill.svg?raw'
import layers from '@material-symbols/svg-400/outlined/layers.svg?raw'
import openInNew from '@material-symbols/svg-400/outlined/open_in_new.svg?raw'
import pause from '@material-symbols/svg-400/outlined/pause.svg?raw'
import playArrow from '@material-symbols/svg-400/outlined/play_arrow.svg?raw'
import publicIcon from '@material-symbols/svg-400/outlined/public.svg?raw'
import skipNext from '@material-symbols/svg-400/outlined/skip_next.svg?raw'
import skipPrevious from '@material-symbols/svg-400/outlined/skip_previous.svg?raw'
import swords from '@material-symbols/svg-400/outlined/swords.svg?raw'

/**
 * Les icones són Material Symbols, com a Petja, però en SVG i només les que es fan servir:
 * la font sencera pesa més d'un mega per una dotzena de glifs.
 */
const ICONS = {
  arrow_back: arrowBack,
  calendar_month: calendarMonth,
  chevron_left: chevronLeft,
  chevron_right: chevronRight,
  close,
  experiment,
  fence,
  flag,
  flag_fill: flagFill,
  history,
  history_edu: historyEdu,
  layers,
  layers_fill: layersFill,
  open_in_new: openInNew,
  pause,
  play_arrow: playArrow,
  public: publicIcon,
  skip_next: skipNext,
  skip_previous: skipPrevious,
  swords,
}

export type IconName = keyof typeof ICONS

/** Sempre decorativa: el nom el porta el control que l'envolta (`aria-label`). */
export function Icon({ name, className = '' }: { name: IconName; className?: string }) {
  return (
    <span
      className={`ms ${className}`}
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: ICONS[name] }}
    />
  )
}
