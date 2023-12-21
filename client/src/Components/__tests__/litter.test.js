/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import renderer from 'react-test-renderer';
import {
  render,
  act,
  screen,
  fireEvent,
  waitFor,
} from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import Cookies from 'js-cookie';
import LandingPage from '../LandingPage';
import Leaderboard from '../Leaderboard';
import CameraCapture from '../Camera/CameraCapture';
import SuccessfulSubmission from '../SuccessfulSubmission/SuccessfulSubmission';
import Profile from '../Profile/Profile';
import ProfileStatistics from '../Profile/ProfileStatistics';
import categoryData from '../../MockData/mockCategoryData';
import * as fetchUserData from '../../utils/fetchUserData';
import { userPictureData } from '../../MockData/mockUserData';
import {
  mockTotalUploads,
  mockPlasticUploads,
  mockMetalUploads,
} from '../../MockData/mockLeaderboardData';

// describe('Home page', () => {
//   test('Landing page matches the current snapshot', () => {
//     const tree = renderer.create(
//       <Router>
//         <LandingPage />
//       </Router>,
//     );
//     expect(tree).toMatchSnapshot();
//   });
// });

describe('Leaderboard component', () => {
  // Function to simulate an API call
  const mockCall = async (data) => {
    await jest.spyOn(fetchUserData, 'fetchLeaderboardData').mockResolvedValue(data);
  };

  // Start each test with total top 10 API call; reset mock after each test
  beforeEach(() => { mockCall(mockTotalUploads); });
  afterEach(() => { jest.restoreAllMocks(); });

  // Creates a snapshot
  test('Leaderboard matches the current snapshot', () => {
    const tree = renderer.create(
      <Router>
        <Leaderboard />
      </Router>,
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('Changes category from total to compost when clicking on the dropdown', async () => {
    await act(() => render(
      <Router>
        <Leaderboard />
      </Router>,
    ));
    // Clicks on dropdown
    fireEvent.mouseDown(screen.getByText('Total'));
    // Changes dropdown to 'Compost'
    await act(() => fireEvent.click(screen.getByText('Compost')));
    // Checking if 'Compost' is now the header on the dropdown
    expect(screen.getByText('Compost')).toBeInTheDocument();
  });

  test('Dropdown option text and background changes color when hovered', async () => {
    await act(() => render(
      <Router>
        <Leaderboard />
      </Router>,
    ));
    // Clicks on dropdown
    fireEvent.mouseDown(screen.getByText('Total'));
    // Hover over new category
    fireEvent.mouseEnter(screen.getByText('Cardboard'));
    // Checking if 'Cardboard' has the hovered color and background color
    const mouseOverCardboard = getComputedStyle(screen.getByText('Cardboard'));
    expect(mouseOverCardboard.color).toBe('rgb(0, 0, 0)');
    expect(mouseOverCardboard.backgroundColor).toBe('rgb(116, 204, 103)');
  });

  test('New data is rendered when a dropdown category is changed', async () => {
    await act(() => render(
      <Router>
        <Leaderboard />
      </Router>,
    ));
    // Change category and data to metal
    mockCall(mockMetalUploads);
    fireEvent.mouseDown(screen.getByText('Total'));
    act(() => fireEvent.click(screen.getByText('Metal')));
    // Checks if a specific user is in the document
    await waitFor(() => {
      expect(screen.getByText('lucious_senger10')).toBeInTheDocument();
    });
    // Change category and data to plastic
    fireEvent.mouseDown(screen.getByText('Metal'));
    act(() => { mockCall(mockPlasticUploads); });
    act(() => fireEvent.click(screen.getByText('Plastic')));
    // Checks if top metal user is no longer there and if a top plastic user is now visible
    await waitFor(() => { expect(screen.queryByText('lucious_senger10')).not.toBeInTheDocument(); });
    await waitFor(() => { expect(screen.getByText('alejandra31')).toBeInTheDocument(); });
  });
});

// describe('Successful submission page', () => {
//   test('Successful submission page matches the current snapshot', () => {
//     // Memory router is used to allow Link component to work properly
//     const tree = renderer.create(
//       <Router initialEntries={['/success/plastic']}>
//         <Routes>
//           <Route
//             path="/success/:category"
//             element={<SuccessfulSubmission />}
//           />
//         </Routes>
//       </Router>,
//     );
//     expect(tree).toMatchSnapshot();
//   });

//   test('Shows the description information for plastic', () => {
//     render(
//       <Router initialEntries={['/success/plastic']}>
//         <Routes>
//           <Route
//             path="/success/:category"
//             element={<SuccessfulSubmission />}
//           />
//         </Routes>
//       </Router>,
//     );
//     expect(screen.getByText('plastic')).toBeInTheDocument();
//     expect(screen.getByText('Recycle')).toBeInTheDocument();
//     expect(screen.getByTestId('plastic-icon')).toBeInTheDocument();
//   });

//   test('Navigates to the home page when "Home" is clicked', async () => {
//     const history = createMemoryHistory({ initialEntries: ['/success/plastic'] });
//     render(
//       <Router history={history} initialEntries={['/success/plastic']}>
//         <Routes>
//           <Route
//             path="/success/:category"
//             element={<SuccessfulSubmission />}
//           />
//           <Route path="/" element={<LandingPage />} />
//         </Routes>
//       </Router>,
//     );
//     // Initial endpoint is /success
//     await waitFor(() => { expect(history.location.pathname).toBe('/success/plastic'); });
//     // Clicks button to navigate to new end point, then pushes endpoint into the history
//     fireEvent.click(screen.getByRole('button', { name: 'Home' }));
//     // Page currently navigates to /capture but doesn't update the endpoint in the history
//     history.push('/');
//     // Checks if page navigated to the landing page and the welcome header is displayed
//     await waitFor(() => { expect(history.location.pathname).toBe('/'); });
//     await waitFor(() => { expect(screen.getByText('Welcome to LitterSort')).toBeInTheDocument(); });
//   });

//   test('Navigates to the capture page when "Capture another photo" is clicked', async () => {
//     const history = createMemoryHistory({ initialEntries: ['/success/plastic'] });
//     render(
//       <Router history={history} initialEntries={['/success/plastic']}>
//         <Routes>
//           <Route path="/success/:category" element={<SuccessfulSubmission />} />
//           <Route path="/capture" element={<CameraCapture />} />
//         </Routes>
//       </Router>,
//     );
//     // Initial endpoint is /success
//     await waitFor(() => { expect(history.location.pathname).toBe('/success/plastic'); });
//     // Clicks button to navigate to new end point, then pushes endpoint into the history
//     fireEvent.click(screen.getByRole('button', { name: 'Capture another photo' }));
//     // Page currently navigates to /capture but doesn't update the endpoint in the history
//     history.push('/capture');
//     // Checks if page navigated to the /capture endpoint
//     await waitFor(() => { expect(history.location.pathname).toBe('/capture'); });
//   });

//   test('Clicking on Learn More opens up a modal with more information', () => {
//     render(
//       <Router initialEntries={['/success/plastic']}>
//         <Routes>
//           <Route
//             path="/success/:category"
//             element={<SuccessfulSubmission />}
//           />
//         </Routes>
//       </Router>,
//     );
//     // Checks if the modal is already open
//     expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
//     // Opens the modal
//     fireEvent.click(screen.getByTestId('modal-learn-more'));

//     // Checks if modal is now visible
//     expect(screen.getByTestId('modal')).toBeInTheDocument();
//     expect(screen.getByTestId('modal-got-it-button')).toBeInTheDocument();

//     // Clicks on Got it to close the modal
//     fireEvent.click(screen.getByTestId('modal-got-it-button'));
//     expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
//   });
// });

// describe('Profile component with user logged in', () => {
//   jest.mock('js-cookie');
//   jest.mock('react', () => ({
//     ...jest.requireActual('react'),
//     useState: jest.fn(),
//   }));
//   jest.mock('../../utils/fetchUserData', () => ({
//     ...jest.requireActual('../../utils/fetchUserData'),
//     fetchProfileData: jest.fn(),
//   }));

//   const mockSetState = jest.fn();

//   test('Profile matches the current snapshot', () => {
//     const tree = renderer.create(
//       <Router>
//         <Profile user="Briana30" setUser={mockSetState} />
//       </Router>,
//     ).toJSON();
//     expect(tree).toMatchSnapshot();
//   });

//   test('Username should appear at the top of the screen', async () => {
//     render(
//       <Router>
//         <Profile user="Briana30" setUser={mockSetState} />
//       </Router>,
//     );
//     expect(screen.getByText('Briana30')).toBeInTheDocument();
//   });

//   test('Statistics should reflect the user\'s data', async () => {
//     fetchUserData.fetchProfileData.mockResolvedValue(userPictureData[0]);
//     React.useState.mockReturnValue(['Briana30', mockSetState]);
//     render(
//       <Router>
//         <Profile user="Briana30" setUser={mockSetState} />
//       </Router>,
//     );
//     expect(screen.getByText('Briana30')).toBeInTheDocument();
//   });
// });
