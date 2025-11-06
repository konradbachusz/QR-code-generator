// =============================================================================
// GOOGLE ADSENSE COMPONENT
// =============================================================================

// This component renders Google AdSense ads
// It uses React's useEffect to initialize ads after the component mounts

import { useEffect } from 'react';

/**
 * AdSense Component for displaying Google Ads
 *
 * @param {string} adSlot - Your AdSense ad unit ID (e.g., "1234567890")
 * @param {string} adFormat - Ad format type (e.g., "auto", "rectangle", "horizontal")
 * @param {boolean} adResponsive - Whether the ad should be responsive (default: true)
 * @param {string} adStyle - Optional inline styles for the ad container
 */
const AdSense = ({
  adSlot,
  adFormat = 'auto',
  adResponsive = true,
  adStyle = { display: 'block' }
}) => {

  useEffect(() => {
    try {
      // Push the ad to AdSense queue
      // This tells Google to load an ad in this slot
      // window.adsbygoogle is provided by the AdSense script
      if (window.adsbygoogle) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (error) {
      console.error('AdSense error:', error);
    }
  }, []); // Empty dependency array means this runs once when component mounts

  return (
    <ins
      className="adsbygoogle"
      style={adStyle}
      data-ad-client="ca-pub-1719990654662590"
      data-ad-slot={adSlot}
      data-ad-format={adFormat}
      data-full-width-responsive={adResponsive.toString()}
    />
  );
};

export default AdSense;
