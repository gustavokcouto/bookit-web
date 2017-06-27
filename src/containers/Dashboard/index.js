import React from 'react'
import PropTypes from 'prop-types'
import momentPropTypes from 'react-moment-proptypes'
import { connect } from 'react-redux'

import { getCurrentUser } from '../../selectors'

import Agenda from '../../components/03-organisms/Agenda'
import Header from '../../components/02-molecules/Header'
import InfoPanel from '../InfoPanel'

import RoomAndMeetingView from '../../coms/RoomAndMeetingView'

import isMeetingOnDate from '../../utils/isMeetingOnDate'

import styles from './styles.scss'

import {
  meetingsFetchStart,
  populateMeetingCreateForm,
  populateMeetingEditForm,
  logout,
 } from '../../actions'

export class DashboardContainer extends React.Component {
  componentDidMount() {
    // This fetches meetings.
    // It should happen whenever `selectedDate` is updated.
    // It should not be called `requestRooms`, probably.
    this.props.requestRooms()
  }

  render() {
    const {
      user,
      meetings,
      rooms,
      onLogoutClick,
      location,
    } = this.props

    return (
      <div className={styles.dashboard}>
        <InfoPanel pathName={location.pathname} />
        <main>
          <Header user={user} logout={onLogoutClick} />
          <Agenda
            meetings={meetings}
            rooms={rooms}
            populateMeetingCreateForm={this.props.populateMeetingCreateForm}
          />
          <RoomAndMeetingView />
        </main>
      </div>
    )
  }
}

DashboardContainer.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }),
  requestRooms: PropTypes.func,
  populateMeetingCreateForm: PropTypes.func.isRequired,
  onLogoutClick: PropTypes.func.isRequired,
  meetings: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      start: momentPropTypes.momentObj.isRequired,
      end: momentPropTypes.momentObj.isRequired,
      duration: PropTypes.number.isRequired,
      isOwnedByUser: PropTypes.bool.isRequired,
      owner: PropTypes.shape({
        name: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
      }).isRequired,
      roomName: PropTypes.string.isRequired,
      roomId: PropTypes.string.isRequired,
    })
  ).isRequired,
  rooms: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired,
    }).isRequired
  ).isRequired,
  location: PropTypes.shape({}),
}


const mapStateToProps = (state) => {
  const {
    allMeetingIds,
    meetingsById,
    allRoomIds,
    roomsById,
    selectedDate,
    isCreatingMeeting,
    isEditingMeeting,
    isCancellingMeeting,
    isInvitingUser,
    inviteUserForm,
    meetingEditForm,
    messages,
    requestedMeeting,
  } = state.app

  const user = getCurrentUser(state)

  const meetings = allMeetingIds
    .map(id => meetingsById[id])
    .filter(meeting => isMeetingOnDate(meeting, selectedDate))
    .map(meeting => ({
      ...meeting,
      isOwnedByUser: meeting.owner.email === user.email }))

  const rooms = allRoomIds.map(id => roomsById[id])

  return ({
    user,
    meetings,
    rooms,
    isCreatingMeeting,
    isEditingMeeting,
    isCancellingMeeting,
    isInvitingUser,
    inviteUserForm,
    meetingEditForm,
    messages,
    selectedDate,
    requestedMeeting,
  })
}

const mapDispatchToProps = dispatch => ({
  requestRooms: () => {
    // Why does `requestRooms` fetch Meetings?
    // TODO: Fetch meetings for selectedDate.
    dispatch(meetingsFetchStart())
  },
  populateMeetingCreateForm: (room, meeting) => {
    dispatch(populateMeetingCreateForm(room, meeting))
  },
  populateMeetingEditForm: (meeting) => {
    dispatch(populateMeetingEditForm(meeting))
  },
  onLogoutClick: () => {
    dispatch(logout())
  },
})

const connected = connect(
  mapStateToProps,
  mapDispatchToProps
)(DashboardContainer)

export default connected
