import ImpulseAlertSystem from './ImpulseAlertSystem'
import VolatilityShieldIndicator from './VolatilityShieldIndicator'
import DynamicRiskMeter from './DynamicRiskMeter'
import SmartTimingRealityCheck from './SmartTimingRealityCheck'
import { useCalmMode } from '../hooks/useCalmMode'

interface CalmModeWidgetProps {
  variant?: 'full' | 'compact' | 'alerts-only'
  showVolatilityShield?: boolean
  showRiskMeter?: boolean
  showTimingCheck?: boolean
}

export default function CalmModeWidget({
  variant = 'full',
  showVolatilityShield = true,
  showRiskMeter = true,
  showTimingCheck = true,
}: CalmModeWidgetProps) {
  const { isEnabled } = useCalmMode()

  if (!isEnabled) return null

  if (variant === 'alerts-only') {
    return <ImpulseAlertSystem />
  }

  if (variant === 'compact') {
    return (
      <>
        <ImpulseAlertSystem />
        {showVolatilityShield && (
          <div className="mb-4">
            <VolatilityShieldIndicator />
          </div>
        )}
      </>
    )
  }

  // Full variant
  return (
    <>
      <ImpulseAlertSystem />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {showVolatilityShield && (
          <div>
            <VolatilityShieldIndicator />
          </div>
        )}
        
        {showRiskMeter && (
          <div>
            <DynamicRiskMeter />
          </div>
        )}
      </div>

      {showTimingCheck && (
        <div className="mt-6">
          <SmartTimingRealityCheck />
        </div>
      )}
    </>
  )
}
