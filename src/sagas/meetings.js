import { call, put } from 'redux-saga/effects';
import { destroy } from 'redux-form';

import api from '../api';

import {
  meetingsFetchSucceeded,
  meetingsFetchFailed,
  meetingCreateFailed,
  closeMeetingDialog,
  meetingCreateSucceeded,
  cancelMeetingSucceeded,
  cancelMeetingFailed,
} from '../actions';

export function* fetchMeetings() {
  try {
    const meetings = yield call(api.fetchMeetings);
    yield put(meetingsFetchSucceeded(meetings));
  } catch (error) {
    yield put(meetingsFetchFailed(error));
  }
}

export function* createMeeting(action) {
  try {
    const meeting = action.payload.meeting;
    const room = action.payload.room;
    yield call(api.createMeeting, meeting, room);
    yield put(closeMeetingDialog());
    yield put(destroy('meeting-editor'));
    yield put(meetingCreateSucceeded());
    yield call(fetchMeetings);
  } catch (err) {
    yield put(meetingCreateFailed(err.response && err.response.body && err.response.body.message));
  }
}
export function* cancelMeeting(action) {
  try {
    const meeting = action.payload.meeting;
    yield call(api.cancelMeeting, meeting); // TODO: Use meeting id instead?
    yield put(cancelMeetingSucceeded());
  } catch (err) {
    console.log(err);
    yield put(cancelMeetingFailed());
  }
}
