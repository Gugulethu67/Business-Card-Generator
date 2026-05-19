import { graphConfig } from '../authConfig';
 
/**
 * Fetches the logged-in user's profile from Microsoft Graph API
 * Returns: displayName, jobTitle, mail, mobilePhone, department, officeLocation
 */
export async function getUserProfile(accessToken) {
  const response = await fetch(graphConfig.graphMeEndpoint, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
 
  if (!response.ok) {
    throw new Error('Failed to fetch user profile from Microsoft Graph');
  }
 
  const data = await response.json();
 
  // Map Graph API fields to our form fields
  const nameParts = (data.displayName || '').split(' ');
  const fname = nameParts[0] || '';
  const lname = nameParts.slice(1).join(' ') || '';
 
  return {
    fname,
    lname,
    title:   data.jobTitle        || '',
    company: data.department      || '',
    email:   data.mail            || data.userPrincipalName || '',
    phone:   data.mobilePhone     || data.businessPhones?.[0] || '',
    website: '',
  };
}
 