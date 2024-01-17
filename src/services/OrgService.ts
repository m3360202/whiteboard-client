import store from '../store';
import { orgApi } from '../redux/OrgAPISlice';
import { BoardListApi } from '../redux/BoardListAPISlice';
import { handleSetRoomList, handleSetCurrentRoomList } from '../store/room';
import { handleSetOrgInfo } from '../store/org';

export default class OrgService {
  static service = null;

  static getInstance(): OrgService {
    if (OrgService.service == null) {
      OrgService.service = new OrgService();
      Boardx.Instance.OrgService = OrgService.service;
    }
    return OrgService.service;
  }

  constructor() { }

  /**
   * Loads organization information based on the provided organization ID.
   * @param {string} orgId - The ID of the organization to load information for.
   */
  loadOrgInfo(orgId) {
    // Get the list of organizations from the store.
    const orgList = store.getState()?.org?.orgList;

    // Check if orgId is not provided or if the orgList is empty.
    if (!orgId || orgList.length == 0) return;

    let orgInfo: any = {};

    // Check if orgId is valid and not 'null' or 'undefined'.
    if (orgId && orgId !== 'null' && orgId !== 'undefined') {
      // Filter the orgList to find the organization matching the provided orgId.
      const orgFilter = orgList.filter(r => r.orgId === orgId);
      orgInfo = orgFilter[0];
    }



    if (!orgInfo) {
      // If orgId is not provided or invalid, use the first organization in the orgList.
      orgInfo = orgList[0];
    }
    // Dispatch an action to set the organization information in the store.
    store.dispatch(
      handleSetOrgInfo({
        orgId: orgInfo?.orgId,
        name: orgInfo?.name,
        role: orgInfo?.role
      })
    );
  }

  /**
   * Loads organization-related data for the specified organization.
   * @param {string} currentOrgId - The ID of the current organization.
   * @param {string} orgNameSwitch - Optional: A switch for organization name (default empty string).
   * @param {string} role - Optional: The role associated with the organization (default empty string).
   */
  loadOrganization(currentOrgId, orgNameSwitch = '', role = '') {
    // Set the current organization ID in local storage.
    localStorage.setItem('orgId', currentOrgId);

    // Load organization information.
    this.loadOrgInfo(currentOrgId);

    // Dispatch actions to reset room-related state.
    store.dispatch(handleSetRoomList([]));
    store.dispatch(handleSetCurrentRoomList([]));

    // Fetch pending deleted boards for the organization.
    // store.dispatch(
    //   BoardListApi.endpoints.getPendingDeletedBoard.initiate(
    //     { orgId: currentOrgId },
    //     {
    //       subscribe: false,
    //       forceRefetch: false
    //     }
    //   )
    // );
  }

  /**
   * Loads the list of rooms for the specified organization.
   * @param {string} orgId - The ID of the organization.
   */
  loadRoomListByOrgId(orgId) {
    // Dispatch an action to fetch the list of rooms for the organization.
    store.dispatch(
      orgApi.endpoints.getRoomListByOrgId.initiate(orgId, {
        subscribe: false,
        forceRefetch: false
      })
    );
  }
}
