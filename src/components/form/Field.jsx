import { useId } from 'react'

/** Label + control + hint/error wrapper. `children` receives the generated id. */
export function Field({ label, hint, error, optional, children, className = '' }) {
  const id = useId()
  return (
    <div className={`field ${error ? 'has-error' : ''} ${className}`}>
      {label && (
        <label className="field__label" htmlFor={id}>
          {label}
          {optional && <span className="field__optional"> (facultatif)</span>}
        </label>
      )}
      {children(id)}
      {error ? (
        <p className="field__error" role="alert">
          {error}
        </p>
      ) : (
        hint && <p className="field__hint">{hint}</p>
      )}
    </div>
  )
}

/** Fieldset with a legend, used for groups of choices. */
export function Group({ legend, hint, error, optional, children }) {
  return (
    <fieldset className={`group ${error ? 'has-error' : ''}`}>
      <legend className="field__label">
        {legend}
        {optional && <span className="field__optional"> (facultatif)</span>}
      </legend>
      {hint && <p className="field__hint group__hint">{hint}</p>}
      {children}
      {error && (
        <p className="field__error" role="alert">
          {error}
        </p>
      )}
    </fieldset>
  )
}
