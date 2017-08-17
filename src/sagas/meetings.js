import { call, put, select } from 'redux-saga/effects'
import { destroy } from 'redux-form'

import api from '../api'

import {
  meetingsFetchSucceeded,
  meetingsFetchFailed,
  closeMeetingDialog,
  cancelMeetingSucceeded,
  cancelMeetingFailed,
  meetingsFetchStart,
  meetingUpsertSucceeded,
  meetingUpsertFailed,
} from '../actions'

import { getUserToken } from '../selectors'

export function* fetchMeetings(action = {}) {
  try {
    const token = yield select(getUserToken)
    const start = action.start ? action.start : undefined
    const end = action.end ? action.end : undefined

    const meetings = yield call(api.fetchMeetings, token, start, end)

    yield put(meetingsFetchSucceeded(meetings))
  } catch (error) {
    yield put(meetingsFetchFailed(error))
  }
}

export function* upsertMeeting(action) {
  // TODO: conditionally create or edit based on presence of meeting id
  try {
    const meeting = {
      id: action.payload.id,
      title: action.payload.title,
      start: action.payload.start,
      end: action.payload.end,
    }
    const room = { email: action.payload.room }
    const token = yield select(getUserToken)

    const mode = meeting.id ? 'update' : 'insert'

    if (mode === 'insert') {
      yield call(api.createMeeting, token, meeting, room)
      yield put(closeMeetingDialog())
      yield put(destroy('meeting-editor'))
      yield put(meetingUpsertSucceeded())
      yield call(fetchMeetings)
    }

    if (mode === 'update') {
      yield call(api.editMeeting, token, meeting, room.email)
      yield put(closeMeetingDialog())
      yield put(destroy('meeting-editor'))
      yield put(meetingUpsertSucceeded())
      yield call(fetchMeetings)
    }

  } catch (err) {
    yield put(meetingUpsertFailed(err.toString()))
  }
}

// export function* createMeeting(action) {
//   try {
//     const token = yield select(getUserToken)
//     const meeting = {
//       title: action.payload.title,
//       start: action.payload.start,
//       end: action.payload.end,
//     }
//     const room = { email: action.payload.room }
//     yield call(api.createMeeting, token, meeting, room)
//     yield put(closeMeetingDialog())
//     yield put(destroy('meeting-editor'))
//     yield put(meetingCreateSucceeded())
//     yield call(fetchMeetings)
//   } catch (err) {
//     yield put(meetingCreateFailed(err.toString()))
//   }
// }
//
// export function* editMeeting(action) {
//   try {
//     const token = yield select(getUserToken)
//     const { payload: { meeting, room } } = action
//     yield call(api.editMeeting, token, meeting, room)
//     yield put(closeMeetingDialog())
//     yield put(destroy('meeting-editor'))
//     yield put(meetingEditSucceeded())
//     yield call(fetchMeetings)
//   } catch (err) {
//     yield put(meetingEditFailed(err.response && err.response.body && err.response.body.message))
//   }
// }

export function* cancelMeeting(action) {
  try {
    const token = yield select(getUserToken)
    const meeting = action.payload.meeting
    yield call(api.cancelMeeting, token, meeting.id, meeting.roomId)
    yield put(cancelMeetingSucceeded())
    yield put(meetingsFetchStart())
  } catch (err) {
    yield put(cancelMeetingFailed())
  }
}
