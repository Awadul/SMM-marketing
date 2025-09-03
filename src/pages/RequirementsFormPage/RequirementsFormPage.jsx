import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import './RequirementsFormPage.css';

const RequirementsFormPage = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    niche: '',
    location: '',
    comments: '',
    dms: '',
    max_following: '',
    hashtags: '',
    account_targets: ''
  });
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('🔄 Starting form submission...');
      console.log('📋 Form data:', formData);
      console.log('👤 User:', user);
      
      if (!user || !user.id) {
        throw new Error('User not authenticated');
      }
      
      // Save requirements to database
      console.log('💾 Saving to database...');
      const { data, error } = await supabase
        .from('user_requirements')
        .insert({
          user_id: user.id,
          niche: formData.niche,
          location: formData.location,
          comments: formData.comments,
          dms: formData.dms,
          max_following: formData.max_following ? parseInt(formData.max_following, 10) : null,
          hashtags: formData.hashtags,
          account_targets: formData.account_targets
        })
        .select()
        .single();

      if (error) {
        console.error('❌ Database error:', error);
        throw new Error(error.message || 'Failed to save requirements');
      }

      console.log('✅ Requirements saved successfully:', data);
      console.log('🚀 Navigating to dashboard...');
      
      // Navigate to dashboard after successful save
      navigate('/dashboard');
      
    } catch (error) {
      console.error('💥 Error submitting requirements:', error);
      alert(`Failed to save requirements: ${error.message || 'Please try again.'}`);
    } finally {
      setLoading(false);
      console.log('🏁 Form submission completed');
    }
  };

  return (
    <div className="requirements-form-page">
      <div className="form-container">
        <div className="form-header">
          <h1>Instagram Growth Requirements</h1>
          <p>Tell us about your target audience and engagement strategy so we can optimize your Instagram growth.</p>
        </div>

        <form onSubmit={handleSubmit} className="requirements-form">
          <div className="form-section">
            <h3>Target Information</h3>
            
            <div className="form-group">
              <label>Niche (Target Audience) *</label>
              <textarea
                value={formData.niche}
                onChange={(e) => handleInputChange('niche', e.target.value)}
                placeholder="e.g., Young professionals aged 25-35 interested in fitness and healthy living"
                required
                rows="3"
              />
            </div>

            <div className="form-group">
              <label>Location *</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="e.g., New York, USA or Worldwide"
                required
              />
            </div>

            <div className="form-group">
              <label>Max Following (numbers only)</label>
              <input
                type="number"
                value={formData.max_following}
                onChange={(e) => handleInputChange('max_following', e.target.value)}
                placeholder="e.g., 10000"
                min="0"
              />
            </div>
          </div>

          <div className="form-section">
            <h3>Engagement Preferences</h3>
            
            <div className="form-group">
              <label>Comments Strategy</label>
              <textarea
                value={formData.comments}
                onChange={(e) => handleInputChange('comments', e.target.value)}
                placeholder="Describe your commenting strategy and preferences"
                rows="3"
              />
            </div>

            <div className="form-group">
              <label>DMs Strategy</label>
              <textarea
                value={formData.dms}
                onChange={(e) => handleInputChange('dms', e.target.value)}
                placeholder="Describe your direct messaging strategy and preferences"
                rows="3"
              />
            </div>
          </div>

          <div className="form-section">
            <h3>Content & Targeting</h3>
            
            <div className="form-group">
              <label>Hashtags</label>
              <textarea
                value={formData.hashtags}
                onChange={(e) => handleInputChange('hashtags', e.target.value)}
                placeholder="e.g., #fitness #health #lifestyle #wellness"
                rows="3"
              />
            </div>

            <div className="form-group">
              <label>Account Targets</label>
              <textarea
                value={formData.account_targets}
                onChange={(e) => handleInputChange('account_targets', e.target.value)}
                placeholder="List target accounts or competitor accounts to follow"
                rows="3"
              />
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="submit" 
              className="submit-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="spinner"></div>
                  Saving Requirements...
                </>
              ) : (
                'Save Requirements & Continue'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RequirementsFormPage;
