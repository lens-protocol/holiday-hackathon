import React from 'react'

export interface ProfileFormData {
  handle: string
  name: string
  bio: string
  picture: File | null
}

interface ProfileFormProps {
  data: ProfileFormData
  onChange: (data: ProfileFormData) => void
  isSubmitting: boolean
  hideHandle?: boolean
}

export function ProfileFormFields({ data, onChange, isSubmitting, hideHandle = false }: ProfileFormProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    onChange({ ...data, [name]: value })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    onChange({ ...data, picture: file })
  }

  return (
    <div className="profile-form-container">
      {!hideHandle && (
        <div className="form-field">
          <label htmlFor="handle" className="form-label">
            Handle
          </label>
          <input
            type="text"
            id="handle"
            name="handle"
            value={data.handle}
            onChange={handleChange}
            placeholder="your-handle"
            className="form-input"
            disabled={isSubmitting}
            required
          />
          <p className="form-hint">This will be your unique identifier on Lens</p>
        </div>
      )}

      <div className="form-field">
        <label htmlFor="name" className="form-label">
          Display Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={data.name}
          onChange={handleChange}
          placeholder="Your Name"
          className="form-input"
          disabled={isSubmitting}
        />
      </div>

      <div className="form-field">
        <label htmlFor="bio" className="form-label">
          Bio
        </label>
        <textarea
          id="bio"
          name="bio"
          value={data.bio}
          onChange={handleChange}
          placeholder="Tell us about yourself"
          rows={3}
          className="form-input"
          disabled={isSubmitting}
        />
      </div>

      <div className="form-field">
        <label htmlFor="picture" className="form-label">
          Profile Picture
        </label>
        <input
          type="file"
          id="picture"
          name="picture"
          onChange={handleFileChange}
          accept="image/*"
          className="form-input file-input"
          disabled={isSubmitting}
        />
      </div>
    </div>
  )
}
