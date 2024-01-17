//** Redux Store */
import { api } from './api';
import store from '../store';
import {
  handleSetCommandData,
  handleSetTeamsCommandData,
  handleSetRecentCommandData,
  handleSetCustomizeCommandData,
  handleSetAllCustomStyleCommand,
  handleSetAdminCommandData,
  handleSetAllCommandData,
  handleSetSearchCommandData,
  handleSetAllPromptPersonaData,
  handleSetChatSessionList,
  handleSetCurrentAgent
} from '../store/AIAssist';

//** Import i18n
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';
/**
 * Filter items based on the language.
 * @param {Array} items - The items to be filtered.
 * @param {string} currentLanguage - The current language setting.
 * @param {string} [language='zh-CN'] - The language to be filtered.
 * @return {Array} The filtered items.
 */
const filterByLanguage = (items, currentLanguage, language = 'zh-CN') => {
  const isEnglish = currentLanguage.indexOf('en') > -1;
  return items.filter(
    item => !item.language || item.language !== (isEnglish ? language : '')
  );
};

/**
 * Filter items based on the typeOfUse.
 * @param {Array} items - The items to be filtered.
 * @param {string} typeOfUse - The type of use to be filtered.
 * @return {Array} The filtered items.
 */
const filterByTypeOfUse = (items, typeOfUse) =>
  items.filter(item => item.typeOfUse === typeOfUse && !item.bindingTemplates);

export const AiAssistApi = api.injectEndpoints({
  endpoints: builder => ({
    /**
     * This endpoint uses a query builder to get all AI commands.
     * After receiving the result, it filters and separates the information based on
     * specific conditions (like `isTeamsPrompt`, `typeOfUse`, etc.).
     * Filtered data dispatched into different parts of the state
     * for further usage across the application.
     * The results are also optimised based on the current language setting.
     */
    getAllAiCommand: builder.query({
      query: () => ({
        serviceName: 'ai.Command.getAll',
        args: {}
      }),
      transformResponse: (response: any[], error?: Error) => {
        if (response == null) {
          return [];
        }
        // Get the current language
        const currentLanguage = i18n.language;

        // Filter and dispatch the command data
        let result = response.filter(
          item =>
            item.isTeamsPrompt &&
            !(item.typeOfUse && item.typeOfUse === 'Persona')
        );

        // TODO: 需要在数据库里过滤
        result = filterByLanguage(result, currentLanguage);

        store.dispatch(handleSetCommandData(result));

        // Filter and dispatch all command data
        const newResponse = response.filter(
          item => item.typeOfUse === undefined || item.typeOfUse !== 'Persona'
        );

        store.dispatch(handleSetAllCommandData(newResponse));

        // Filter and dispatch all prompt persona data
        let allPromptPersonaData = filterByTypeOfUse(response, 'Persona');
        allPromptPersonaData = filterByLanguage(
          allPromptPersonaData,
          currentLanguage
        );

        store.dispatch(handleSetAllPromptPersonaData(allPromptPersonaData));

        return result;
      },
      providesTags: ['aiCommandList']
    }),

    getAllAiAgentList: builder.query({
      query: ({ type, orgId }) => ({
        serviceName: 'ai.Agent.getAll',
        args: { type, orgId }
      }),
      transformResponse: (response: any, error) => {
        // store.dispatch(handleSetAiAgentData(response));
        return response;
      },
      providesTags: ['aiAgentList']
    }),

    getMyAgentList: builder.query({
      query: ({ orgId }) => ({
        serviceName: 'ai.Agent.getMyAgents',
        args: { orgId },
        skip: !orgId
      }),
      transformResponse: (response: any, error) => {
        return response;
      },
      providesTags: ['myAgentList']
    }),

    addAiAgent: builder.mutation({
      query: ({ agentData }) => ({
        serviceName: 'ai.Agent.add',
        args: { agentData }
      }),
      transformResponse: (response: any, error) => {
        return response;
      },
      async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
  
        try {
          await queryFulfilled;
        } catch { }
      },
      invalidatesTags: ['aiAgentList']
    }),

    updateAiAgent: builder.mutation({
      query: ({ newAgentData }) => ({
        serviceName: 'ai.Agent.update',
        args: { newAgentData }
      }),
      transformResponse: (response: any, error) => {
        return response;
      },
      async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch { }
      },

      invalidatesTags: ['aiAgentList']
    }),

    deleteAiAgent: builder.mutation({
      query: ({ agentId }) => ({
        serviceName: 'ai.Agent.delete',
        args: { agentId }
      }),
      transformResponse: (response: any, error) => {
        return response;
      },
      async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
        const aiAgentList = store.getState().AIAssist.aiAgentList;

        const data = aiAgentList.filter(item => item._id !== patch.agentId);

        // store.dispatch(handleSetaiAgentData(data));

        try {
          await queryFulfilled;
        } catch { }
      },
      invalidatesTags: ['aiAgentList']
    }),

    /**
     * Define the builder query for getting all AI commands of a team
     */
    getAllTeamsAiCommand: builder.query({
      query: ({ orgId }) => ({
        serviceName: 'teams.AiCommand.getAll',
        args: { orgId }
      }),
      transformResponse: (response: any, error) => {
        // Filter out items where 'typeOfUse' is 'undefined' or not equal to 'Persona'
        const filteredResult = response.filter(
          item => !item.typeOfUse || item.typeOfUse !== 'Persona'
        );

        // Dispatch the result to the local store
        store.dispatch(handleSetTeamsCommandData(filteredResult));

        return filteredResult;
      },
      providesTags: ['teamsAiCommandList']
    }),

    /**
     * Querying a specific service by name 'getUserCustomizeImgCommand' with arguments like 'userId'
     * This service will probably fetch the custom image command for the provided user.
     */
    getUserCustomizeImgCommand: builder.query({
      query: ({ userId }) => ({
        serviceName: 'getUserCustomizeImgCommand',
        args: { userId }
      }),
      transformResponse: (response: any, error) => {
        store.dispatch(handleSetCustomizeCommandData(response));

        return response;
      },
      providesTags: ['userCustomizeImgCommandList']
    }),

    /**
     * The `favoriteAICommand` function is a mutation that sends a favorite or unfavorite AI command request to the server.
     * It does this by taking the commandId, favorite state and type as its parameters.
     *
     * Finally, it invalidates the cached data of AI commands and custom style commands in the Redux state so they can be refetched with their latest state.
     */
    favoriteAICommand: builder.mutation({
      query: ({ commandId, userId }) => ({
        serviceName: 'favoriteAICommand',
        args: { commandId, userId }
      }),
      transformResponse: (response, error) => response,
      async onQueryStarted({ commandId, type }, { dispatch, queryFulfilled, getState }) {
        // Constants for state keys
        const COMMAND_DATA = 'commandData';
        const RECENT_COMMAND_DATA = 'recentCommandData';
        const TEAMS_COMMAND_DATA = 'teamsCommandData';
        const SEARCH_COMMAND_DATA = 'searchCommandData';
    
        // Utility function to update command data
        const updateCommandData = (commandData, commandId) => {
          const index = commandData.findIndex(command => command._id === commandId);
          if (index !== -1) {
            return [
              ...commandData.slice(0, index),
              { 
                ...commandData[index], 
                favoriteCommand: { 
                  ...commandData[index].favoriteCommand, 
                  favorite: !commandData[index].favoriteCommand.favorite 
                }
              },
              ...commandData.slice(index + 1)
            ];
          }
          return commandData;
        };
    
        try {
          const state = store.getState().AIAssist;
          const AICommandData = state[COMMAND_DATA];
          const recentCommandData = state[RECENT_COMMAND_DATA];
          const teamsCommandData = state[TEAMS_COMMAND_DATA];
          const searchCommandData = state[SEARCH_COMMAND_DATA];
    
          const updatedAICommandData = updateCommandData(AICommandData, commandId);
          dispatch(handleSetCommandData([]));
          dispatch(handleSetCommandData(updatedAICommandData));
    
          if (type !== 'imageCommand') {
            const updatedRecentCommandData = updateCommandData(recentCommandData, commandId);
            dispatch(handleSetRecentCommandData([]));
            dispatch(handleSetRecentCommandData(updatedRecentCommandData));
    
            const updatedTeamsCommandData = updateCommandData(teamsCommandData, commandId);
            dispatch(handleSetTeamsCommandData([]));
            dispatch(handleSetTeamsCommandData(updatedTeamsCommandData));
    
            const updatedSearchCommandData = updateCommandData(searchCommandData, commandId);
            dispatch(handleSetSearchCommandData([]));

            dispatch(handleSetSearchCommandData(updatedSearchCommandData));
          }
    
          // Await for the query to be fulfilled
          await queryFulfilled;
    
        } catch (error) {
          console.error('Error updating favorite AI command:', error);
        }
      },
      // Uncomment and modify tags as necessary
      // invalidatesTags: ['aiCommandList', 'aiCustomStyleCommand', 'teamsAiCommandList']
    }),
    
    /**
     * This function sends a query to fetch all custom style commands from the AI service.
     * It then transforms the response by assigning ids to each item and sorts them based on the 'usedTimes' property in descending order.
     * The sorted response is then dispatched to the store to update the state.
     * It also provides tags for the fetched data for cache updates and invalidation.
     */
    getAiAllCustomStyleCommand: builder.query({
      query: () => ({
        serviceName: 'ai.CustomStyleCommand.getAll',
        args: {}
      }),
      transformResponse: (response: any, error) => {
        response = response.map((item, index) => {
          item.id = index;
          return item;
        });

        response.sort((a, b) => (a.usedTimes < b.usedTimes ? 1 : -1));

        store.dispatch(handleSetAllCustomStyleCommand(response));

        return response;
      },
      providesTags: ['aiCustomStyleCommand', 'aiCommandList']
    }),

    /**
     * This function is a mutation function meant to add a new AI Custom Style Command
     * It then dispatches an action to update the local state with this new command, while awaiting server response.
     * If the query is fulfilled, it will be considered as a success. Any error during the process would be caught and handled.
     */
    adminAddAiCustomStyleCommand: builder.mutation({
      query: ({ command }) => ({
        serviceName: 'ai.CustomStyleCommand.add',
        args: { command }
      }),
      transformResponse: (response: any, error) => {
        return response;
      },
      async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
        const customStylecommandData =
          store.getState().AIAssist.allCustomStyleCommand;

        patch.command.id = patch.command._id;

        dispatch(
          handleSetAllCustomStyleCommand([
            ...customStylecommandData,
            patch.command
          ])
        );

        try {
          await queryFulfilled;
        } catch { }
      },
      invalidatesTags: ['aiCustomStyleCommand']
    }),

    /**
     * The 'adminUpdateAiCustomStyleCommand' mutation builder is used to update a selected AI Custom Style Command using the provided updateCommand object.
     * The mutation builder calls the 'ai.CustomStyleCommand.update' service and passes the updateCommand object as argument.
     * The onQueryStarted lifecycle event handler then updates the corresponding custom style command item in the state store with the update information provided in updateCommand.
     * If the command update is fulfilled successfully, the 'aiCustomStyleCommand' tag gets invalidated to prompt a re-fetch of potentially modified data.
     * If the command update fails, the previous state before the update remains in place because the error is merely caught and does not affect the state.
     */
    adminUpdateAiCustomStyleCommand: builder.mutation({
      query: ({ updateCommand, currentSelectCommand }) => ({
        serviceName: 'ai.CustomStyleCommand.update',
        args: { updateCommand }
      }),
      transformResponse: (response: any, error) => {
        return response;
      },
      async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
        const customStylecommandData =
          store.getState().AIAssist.allCustomStyleCommand;

        const index = customStylecommandData.findIndex(
          item => item._id === patch.currentSelectCommand._id
        );

        const updatedCustomStylecommandData = {
          ...customStylecommandData[index],
          ...patch.updateCommand
        };

        // customStylecommandData[index] = updatedCustomStylecommandData;

        // customStylecommandData[index].name = patch.updateCommand.name;
        // customStylecommandData[index].type = patch.updateCommand.type;
        // customStylecommandData[index].weight = patch.updateCommand.weight;
        // customStylecommandData[index].description =
        //   patch.updateCommand.description;
        // customStylecommandData[index].category = patch.updateCommand.category;
        // customStylecommandData[index].command = patch.updateCommand.command;
        // customStylecommandData[index].width = patch.updateCommand.width;
        // customStylecommandData[index].height = patch.updateCommand.height;
        // customStylecommandData[index].icon = patch.updateCommand.icon;
        // customStylecommandData[index].backgroundUrl =
        //   patch.updateCommand.backgroundUrl;
        // customStylecommandData[index].isFeatured =
        //   patch.updateCommand.isFeatured;
        // dispatch(handleSetAllCustomStyleCommand(customStylecommandData));

        try {
          await queryFulfilled;
        } catch { }
      },
      invalidatesTags: ['aiCustomStyleCommand']
    }),

    /**
     * Mutation for deleting a custom style command in the AI system.
     *
     * @param {object} query - The GraphQL query object with the 'commandId' argument.
     * @param {object} transformResponse - A function for transforming the response or error.
     * @param {function} onQueryStarted - An asynchronous function executed when the query is started.
     * @param {array} invalidatesTags - An array of tags to invalidate when the mutation is executed.
     */
    adminDeleteAiCustomStyleCommand: builder.mutation({
      query: ({ commandId }) => ({
        serviceName: 'ai.CustomStyleCommand.delete',
        args: { commandId }
      }),
      transformResponse: (response: any, error) => {
        return response;
      },
      async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
        // Retrieve the current state of custom style command data from the AIAssist store.
        const customStylecommandData =
          store.getState().AIAssist.allCustomStyleCommand;

        // Filter out the deleted command by comparing 'commandId' with the patch data.
        const data = customStylecommandData.filter(
          item => item._id !== patch.commandId
        );

        // Dispatch an action to update allCustomStyleCommand data with the filtered data.
        dispatch(handleSetAllCustomStyleCommand(data));

        try {
          await queryFulfilled;
        } catch { }
      },
      // Define the tags that should be invalidated when this mutation is executed.
      invalidatesTags: ['aiCustomStyleCommand']
    }),

    /**
     * Mutation for adding a customized image command in the AI system.
     *
     * @param {object} query - The GraphQL query object with arguments:
     *   - currentSelectImgCommand: The currently selected image command to add.
     *   - showCustomizeStyle: A flag indicating whether to show customized style.
     *   - customizeStyleName: The name of the customize style (if shown).
     * @param {object} transformResponse - A function for transforming the response or error.
     * @param {function} onQueryStarted - An asynchronous function executed when the query is started.
     * @param {array} invalidatesTags - An array of tags to invalidate when the mutation is executed.
     */
    addCustomizeImgCommand: builder.mutation({
      query: ({
        currentSelectImgCommand,
        showCustomizeStyle,
        customizeStyleName
      }) => ({
        serviceName: 'addCustomizeImgCommand',
        args: { currentSelectImgCommand }
      }),
      transformResponse: (response: any, error) => {
        return response;
      },
      async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
        // Retrieve the current state of customize command data from the AIAssist store.
        const customizeCommandData =
          store.getState().AIAssist.customizeCommandData;

        // Create a new customized image command object with the provided data.
        const newCustomizedCommand = {
          ...patch.currentSelectImgCommand,
          name: patch.showCustomizeStyle
            ? patch.customizeStyleName
            : patch.currentSelectImgCommand.name
        };

        // Update the customizeCommandData array with the new command at the beginning.
        dispatch(
          handleSetCustomizeCommandData([
            newCustomizedCommand,
            ...customizeCommandData
          ])
        );

        try {
          await queryFulfilled;
        } catch { }
      },
      invalidatesTags: ['userCustomizeImgCommandList']
    }),

    /**
     * Mutation for updating a customized image command in the AI system.
     *
     * @param {object} query - The GraphQL query object with arguments:
     *   - commandId: The ID of the image command to update.
     *   - newImgCommandData: The updated data for the image command.
     * @param {object} transformResponse - A function for transforming the response or error.
     * @param {array} invalidatesTags - An array of tags to invalidate when the mutation is executed.
     */
    updateCustomizeImgCommand: builder.mutation({
      query: ({ commandId, newImgCommandData }) => ({
        serviceName: 'updateCustomizeImgCommand',
        args: { commandId, newImgCommandData }
      }),
      transformResponse: (response: any, error) => {
        return response;
      },
      invalidatesTags: ['userCustomizeImgCommandList']
    }),

    /**
     * Query for retrieving a list of all AI commands for administration purposes.
     *
     * @returns {Array} An array of AI commands.
     */
    getAdminPageAllAiCommand: builder.query({
      query: () => ({
        serviceName: 'ai.Command.getAll',
        args: {}
      }),
      transformResponse: (response: any[], error) => {
        if (response == null) {
          return [];
        }
        // Assign unique IDs to each command and set a default language if missing.
        let result = response.map((item, index) => {
          item.id = index;
          if (!item.language) {
            item.language = 'en';
          }
          return item;
        });

        // Sort the commands based on their usage count in descending order.
        result.sort((a, b) => (a.usedTimes < b.usedTimes ? 1 : -1));

        // Dispatch an action to update the admin command data in the store.
        store.dispatch(handleSetAdminCommandData(result));

        // Return the transformed result.
        return result;
      },
      providesTags: ['aiCommandList']
    }),

    /**
     * Mutation for deleting an AI command in the administration panel.
     *
     * @param {object} query - The GraphQL query object with the 'commandId' argument.
     * @param {object} transformResponse - A function for transforming the response or error.
     * @param {function} onQueryStarted - An asynchronous function executed when the query is started.
     * @param {array} invalidatesTags - An array of tags to invalidate when the mutation is executed.
     */
    adminDeleteAiCommand: builder.mutation({
      query: ({ commandId }) => ({
        serviceName: 'ai.Command.delete',
        args: { commandId }
      }),
      transformResponse: (response: any, error) => {
        return response;
      },
      async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
        // Retrieve the current state of admin command data from the AIAssist store.
        const commandData = store.getState().AIAssist.adminCommandData;

        // Filter out the deleted command by comparing 'commandId' with the patch data.
        const data = commandData.filter(item => item._id !== patch.commandId);

        // Update the adminCommandData array with the filtered data.
        store.dispatch(handleSetAdminCommandData(data));

        try {
          await queryFulfilled;
        } catch { }
      },
      invalidatesTags: ['aiCommandList']
    }),


   

    /**
     * Mutation for deleting an AI command within a team.
     *
     * @param {object} query - The GraphQL query object with the 'commandId' argument.
     * @param {object} transformResponse - A function for transforming the response or error.
     * @param {function} onQueryStarted - An asynchronous function executed when the query is started.
     * @param {array} invalidatesTags - An array of tags to invalidate when the mutation is executed.
     */
    teamsDeleteAiCommand: builder.mutation({
      query: ({ commandId }) => ({
        serviceName: 'teams.AiCommand.delete',
        args: { commandId }
      }),
      transformResponse: (response: any, error) => {
        return response;
      },
      async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
        // Retrieve the current state of team-specific command data from the AIAssist store.
        const commandData = store.getState().AIAssist.teamsCommandData;

        // Filter out the deleted command by comparing 'commandId' with the patch data.
        const data = commandData.filter(item => item._id !== patch.commandId);

        // Update the teamsCommandData array with the filtered data.
        store.dispatch(handleSetTeamsCommandData(data));

        try {
          await queryFulfilled;
        } catch { }
      },
      invalidatesTags: ['teamsAiCommandList']
    }),

    /**
     * Mutation for adding a new AI command in the administration panel.
     *
     * @param {object} query - The GraphQL query object with the 'commandData' argument.
     * @param {object} transformResponse - A function for transforming the response or error.
     * @param {function} onQueryStarted - An asynchronous function executed when the query is started.
     * @param {array} invalidatesTags - An array of tags to invalidate when the mutation is executed.
     */
    adminAddAiCommand: builder.mutation({
      query: ({ commandData }) => ({
        serviceName: 'ai.Command.add',
        args: { commandData }
      }),
      transformResponse: (response: any, error) => {
        return response;
      },
      async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
        // Retrieve the current state of admin command data from the AIAssist store.
        const commandData = store.getState().AIAssist.adminCommandData;

        // Assign a unique ID to the new command based on its '_id'.
        patch.commandData.id = patch.commandData._id;

        // Update the adminCommandData array with the newly added command.
        store.dispatch(
          handleSetAdminCommandData([...commandData, patch.commandData])
        );

        try {
          await queryFulfilled;
        } catch { }
      },
      invalidatesTags: ['aiCommandList']
    }),


    /**
     * Mutation for adding a new AI command within a team.
     *
     * @param {object} query - The GraphQL query object with the 'commandData' argument.
     * @param {object} transformResponse - A function for transforming the response or error.
     * @param {function} onQueryStarted - An asynchronous function executed when the query is started.
     * @param {array} invalidatesTags - An array of tags to invalidate when the mutation is executed.
     */
    teamsAddAiCommand: builder.mutation({
      query: ({ commandData }) => ({
        serviceName: 'teams.AiCommand.add',
        args: { commandData }
      }),
      transformResponse: (response: any, error) => {
        return response;
      },
      async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
        // Retrieve the current state of team-specific command data from the AIAssist store.
        const commandData = store.getState().AIAssist.teamsCommandData;

        // Assign a unique ID to the new command based on its '_id'.
        patch.commandData.id = patch.commandData._id;

        // Update the teamsCommandData array with the newly added command.
        store.dispatch(
          handleSetTeamsCommandData([...commandData, patch.commandData])
        );
        try {
          await queryFulfilled;
        } catch { }
      },
      invalidatesTags: ['teamsAiCommandList']
    }),

    /**
     * Mutation for adding multiple new AI commands within a team.
     *
     * @param {object} query - The GraphQL query object with the 'commandData' argument.
     * @param {object} transformResponse - A function for transforming the response or error.
     * @param {function} onQueryStarted - An asynchronous function executed when the query is started.
     * @param {array} invalidatesTags - An array of tags to invalidate when the mutation is executed.
     */
    teamsAddManyAiCommand: builder.mutation({
      query: ({ commandData }) => ({
        serviceName: 'teams.AiCommand.addMany',
        args: { commandData }
      }),
      transformResponse: (response: any, error) => {
        return response;
      },
      async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
        // Retrieve the current state of team-specific command data from the AIAssist store.
        const commandData = store.getState().AIAssist.teamsCommandData;

        // Assign a unique ID to each new command based on its '_id'.
        patch.commandData.id = patch.commandData._id;

        // Update the teamsCommandData array by concatenating the new commands.
        store.dispatch(
          handleSetTeamsCommandData(commandData.concat(patch.commandData))
        );
        try {
          await queryFulfilled;
        } catch { }
      },
      invalidatesTags: ['teamsAiCommandList']
    }),

    /**
     * Mutation for updating an AI command in the administration panel.
     *
     * @param {object} query - The GraphQL query object with arguments:
     *   - newCommandData: The updated data for the AI command.
     *   - oldCommandData: The original data of the AI command to be updated.
     * @param {object} transformResponse - A function for transforming the response or error.
     * @param {function} onQueryStarted - An asynchronous function executed when the query is started.
     * @param {array} invalidatesTags - An array of tags to invalidate when the mutation is executed.
     */
    adminUpdateAiCommand: builder.mutation({
      query: ({ newCommandData, oldCommandData }) => ({
        serviceName: 'ai.Command.update',
        args: { newCommandData }
      }),
      transformResponse: (response: any, error) => {
        return response;
      },
      async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
        // Retrieve the current state of admin command data from the AIAssist store.
        const commandData = [...store.getState().AIAssist.adminCommandData]; // Create a shallow copy

        // Find the index of the AI command to be updated in the array.
        const index = commandData.findIndex(
          item => item._id === patch.oldCommandData._id
        );

        // Create a copy of the specific object you want to change
        const updatedCommand = {
          ...commandData[index],
          ...patch.newCommandData
        };

        // Replace the old object with the new object in the array
        commandData[index] = updatedCommand;

        // Dispatch an action to update the admin command data in the store.
        store.dispatch(handleSetAdminCommandData(commandData));

        try {
          await queryFulfilled;
        } catch { }
      },

      invalidatesTags: ['aiCommandList']
    }),

   
    /**
     * Mutation for updating an AI command within a team.
     *
     * @param {object} query - The GraphQL query object with arguments:
     *   - newCommandData: The updated data for the AI command.
     *   - oldCommandData: The original data of the AI command to be updated.
     * @param {object} transformResponse - A function for transforming the response or error.
     * @param {function} onQueryStarted - An asynchronous function executed when the query is started.
     * @param {array} invalidatesTags - An array of tags to invalidate when the mutation is executed.
     */
    teamsUpdateAiCommand: builder.mutation({
      query: ({ newCommandData, oldCommandData }) => ({
        serviceName: 'teams.AiCommand.update',
        args: { newCommandData }
      }),
      transformResponse: (response: any, error) => {
        return response;
      },
      async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
        // Retrieve the current state of team-specific command data from the AIAssist store.
        const commandData = [...store.getState().AIAssist.teamsCommandData]; // Create a shallow copy

        // Find the index of the AI command to be updated in the array.
        const index = commandData.findIndex(
          item => item._id === patch.oldCommandData._id
        );

        // Create a copy of the specific object you want to change
        const updatedCommand = {
          ...commandData[index],
          ...patch.newCommandData
        };

        // Replace the old object with the new object in the array
        commandData[index] = updatedCommand;

        // Dispatch an action to update the team-specific command data in the store.
        store.dispatch(handleSetTeamsCommandData(commandData));

        try {
          await queryFulfilled;
        } catch { }
      },
      invalidatesTags: ['teamsAiCommandList']
    }),

    /**
     * Query for retrieving a list of all AI models.
     *
     * @param {object} query - The GraphQL query object with no additional arguments.
     * @param {object} transformResponse - A function for transforming the response or error.
     * @param {array} providesTags - An array of tags to indicate data availability.
     */
    getAiModelAllData: builder.query({
      query: () => ({
        serviceName: 'ai.Model.getAll',
        args: {}
      }),
      transformResponse: (response: any, error) => {
        return response;
      },
      providesTags: ['aiModelList']
    }),

    /**
     * Mutation for deleting an AI model in the administration panel.
     *
     * @param {object} query - The GraphQL query object with the 'modelId' argument.
     * @param {object} transformResponse - A function for transforming the response or error.
     * @param {function} onQueryStarted - An asynchronous function executed when the query is started.
     * @param {array} invalidatesTags - An array of tags to invalidate when the mutation is executed.
     */
    adminDeleteAiModel: builder.mutation({
      query: ({ modelId }) => ({
        serviceName: 'ai.Model.delete',
        args: { modelId }
      }),
      transformResponse: (response: any, error) => {
        return response;
      },
      async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch { }
      },
      invalidatesTags: ['aiModelList']
    }),

    /**
     * Mutation for adding a new AI model in the administration panel.
     *
     * @param {object} query - The GraphQL query object with the 'modelData' argument.
     * @param {object} transformResponse - A function for transforming the response or error.
     * @param {function} onQueryStarted - An asynchronous function executed when the query is started.
     * @param {array} invalidatesTags - An array of tags to invalidate when the mutation is executed.
     */
    adminAddAiModel: builder.mutation({
      query: ({ modelData }) => ({
        serviceName: 'ai.Model.add',
        args: { modelData }
      }),
      transformResponse: (response: any, error) => {
        return response;
      },
      async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch { }
      },
      invalidatesTags: ['aiModelList']
    }),

    /**
     * Mutation for updating an AI model in the administration panel.
     *
     * @param {object} query - The GraphQL query object with the 'newModelData' argument.
     * @param {object} transformResponse - A function for transforming the response or error.
     * @param {function} onQueryStarted - An asynchronous function executed when the query is started.
     * @param {array} invalidatesTags - An array of tags to invalidate when the mutation is executed.
     */
    adminUpdateAiModel: builder.mutation({
      query: ({ newModelData }) => ({
        serviceName: 'ai.Model.update',
        args: { newModelData }
      }),
      transformResponse: (response: any, error) => {
        return response;
      },
      async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch { }
      },
      invalidatesTags: ['aiModelList']
    }),

    /**
     * Query for retrieving a list of all trained data for a specific AI model.
     *
     * @param {object} query - The GraphQL query object with the 'modelId' argument.
     * @param {object} transformResponse - A function for transforming the response or error.
     * @param {array} providesTags - An array of tags to indicate data availability.
     */
    getAiModelTrainedAllData: builder.query({
      query: ({ modelId }) => ({
        serviceName: 'ai.ModelTrained.getAll',
        args: { modelId }
      }),
      transformResponse: (response: any, error) => {
        return response;
      },
      providesTags: ['aiModelTrainedList']
    }),

    /**
     * Mutation for adding trained data to an AI model in the administration panel.
     *
     * @param {object} query - The GraphQL query object with the 'modelTrainedData' argument.
     * @param {object} transformResponse - A function for transforming the response or error.
     * @param {function} onQueryStarted - An asynchronous function executed when the query is started.
     * @param {array} invalidatesTags - An array of tags to invalidate when the mutation is executed.
     */
    adminAddAiModelTrained: builder.mutation({
      query: ({ modelTrainedData }) => ({
        serviceName: 'ai.ModelTrained.add',
        args: { modelTrainedData }
      }),
      transformResponse: (response: any, error) => {
        return response;
      },
      async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch { }
      },
      invalidatesTags: ['aiModelTrainedList']
    }),

    /**
     * Mutation for deleting a row of trained data from an AI model in the administration panel.
     *
     * @param {object} query - The GraphQL query object with the 'trainedDataId' argument.
     * @param {object} transformResponse - A function for transforming the response or error.
     * @param {function} onQueryStarted - An asynchronous function executed when the query is started.
     * @param {array} invalidatesTags - An array of tags to invalidate when the mutation is executed.
     */
    adminDeleteAiModelRowTrainedData: builder.mutation({
      query: ({ trainedDataId }) => ({
        serviceName: 'ai.ModelRowTrained.delete',
        args: { trainedDataId }
      }),
      transformResponse: (response: any, error) => {
        return response;
      },
      async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch { }
      },
      invalidatesTags: ['aiModelTrainedList']
    }),

    /**
     * Mutation for deleting all trained data associated with an AI model in the administration panel.
     *
     * @param {object} query - The GraphQL query object with the 'modelId' argument.
     * @param {object} transformResponse - A function for transforming the response or error.
     * @param {function} onQueryStarted - An asynchronous function executed when the query is started.
     * @param {array} invalidatesTags - An array of tags to invalidate when the mutation is executed.
     */
    adminDeleteAiModelAllTrainedData: builder.mutation({
      query: ({ modelId }) => ({
        serviceName: 'ai.ModelAllTrained.delete',
        args: { modelId }
      }),
      transformResponse: (response: any, error) => {
        return response;
      },
      async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch { }
      },
      invalidatesTags: ['aiModelTrainedList']
    }),

    /**
     * Query for retrieving information about AI fine-tuned models.
     *
     * @param {object} query - The GraphQL query object with no additional arguments.
     * @param {object} transformResponse - A function for transforming the response or error.
     */
    getAIFineTuneModel: builder.query({
      query: () => ({
        serviceName: 'ai.getAIFineTuneModel',
        args: {}
      }),
      transformResponse: (response: any, error) => {
        let data = [];
        response.map(item => {
          if (item.status === 'succeeded') data.push(item.fine_tuned_model);
        });
        return data;
      }
    }),

    /**
     * Query for retrieving a list of AI chat sessions for a specific user and organization.
     *
     * @param {object} query - The GraphQL query object with the 'userId' and 'orgId' arguments.
     * @param {object} transformResponse - A function for transforming the response or error.
     * @param {array} providesTags - An array of tags to indicate data availability.
     */
    getAIChatSessionList: builder.query({
      query: ({ userId, orgId }) => ({
        serviceName: 'ai.AIChatSession.getAll',
        args: { orgId },
        skip: !userId || !orgId
      }),
      transformResponse: (response: any, error) => {
        store.dispatch(handleSetChatSessionList(response));
        return response;
      },
      providesTags: ['aiChatSessionList']
    }),

    /**
     * Mutation for adding a new AI chat session.
     *
     * @param {object} query - The GraphQL query object with the 'newAIChatdata' argument.
     * @param {object} transformResponse - A function for transforming the response or error.
     * @param {function} onQueryStarted - An asynchronous function executed when the query is started.
     * @param {array} invalidatesTags - An array of tags to invalidate when the mutation is executed.
     */
    addNewAIChatSession: builder.mutation({
      query: ({ newAIChatdata }) => ({
        serviceName: 'ai.AIChatSession.add',
        args: { newAIChatdata }
      }),
      transformResponse: (response: any, error) => {
        return response;
      },
      async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch { }
      },
      invalidatesTags: ['aiChatSessionList']
    }),

    /**
     * Mutation for updating an AI chat session.
     *
     * @param {object} query - The GraphQL query object with the 'aiChatSessionId' and 'updateData' arguments.
     * @param {object} transformResponse - A function for transforming the response or error.
     * @param {function} onQueryStarted - An asynchronous function executed when the query is started.
     * @param {array} invalidatesTags - An array of tags to invalidate when the mutation is executed.
     */
    updateAIChatSession: builder.mutation({
      query: ({ aiChatSessionId, updateData }) => ({
        serviceName: 'ai.AIChatSession.update',
        args: { aiChatSessionId, updateData }
      }),
      transformResponse: (response: any, error) => {
        return response;
      },
      async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch { }
      },
      invalidatesTags: ['aiChatSessionList']
    }),

    /**
     * Mutation for updating information related to an AI chat message, such as agree/disagree votes.
     *
     * @param {object} query - The GraphQL query object with the 'agree', 'disagree', and 'chatAIMessage' arguments.
     * @param {object} transformResponse - A function for transforming the response or error.
     * @param {function} onQueryStarted - An asynchronous function executed when the query is started.
     */
    updateAIChatMsgInfo: builder.mutation({
      query: ({ agree, disagree, chatAIMessage }) => ({
        serviceName: 'ai.updateAIChatMsgInfo',
        args: { agree, disagree, chatAIMessage }
      }),
      transformResponse: (response: any, error) => {
        return response;
      },
      async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch { }
      }
    }),

    // board ai context
    saveBoardAiContextContent: builder.mutation({
      query: data => ({
        serviceName: 'saveBoardAiContextContent',
        args: { data }
      }),
      transformResponse: (response, error) => {
        return response;
      },
      invalidatesTags: ['aiChatContext']
    }),
    getBoardAiContextContent: builder.query({
      query: boardId => {
        console.log('getBoardAiContextContent', boardId)
        return ({
        serviceName: 'getBoardAiContextContent',
        args: { boardId },
        skip: !boardId
      })},
      transformResponse: (response, error) => {
        console.log('getBoardAiContextContent Response', response,error)
        return response;
      },
      providesTags: ['aiChatContext']
    }),

    // room ai context
    saveRoomAiContextContent: builder.mutation({
      query: data => ({
        serviceName: 'saveRoomAiContextContent',
        args: { data }
      }),
      transformResponse: (response, error) => {
        return response;
      },
      invalidatesTags: ['aiChatContext']
    }),
    getRoomAiContextContent: builder.query({
      query: roomId => {
        console.log('getRoomAiContextContent', roomId)
        return ({
        serviceName: 'getRoomAiContextContent',
        args: { roomId },
        skip: !roomId
      })},
      transformResponse: (response, error) => {
        return response;
      },
      providesTags: ['aiChatContext']
    }),

    // team ai context
    saveTeamAiContextContent: builder.mutation({
      query: data => ({
        serviceName: 'saveTeamAiContextContent',
        args: { data }
      }),
      transformResponse: (response, error) => {
        return response;
      },
      invalidatesTags: ['aiChatContext']
    }),
    getTeamAiContextContent: builder.query({
      query: teamId => {
        console.log('getTeamAiContextContent', teamId)
        return ({
        serviceName: 'getTeamAiContextContent',
        args: { teamId },
        skip: !teamId
      })},
      transformResponse: (response, error) => {
        return response;
      },
      providesTags: ['aiChatContext']
    })
  })
});

export const {
  useGetAllAiCommandQuery,
  useGetUserCustomizeImgCommandQuery,
  useFavoriteAICommandMutation,
  useGetAiAllCustomStyleCommandQuery,
  useAdminDeleteAiCustomStyleCommandMutation,
  useAdminAddAiCustomStyleCommandMutation,
  useAdminUpdateAiCustomStyleCommandMutation,
  useAddCustomizeImgCommandMutation,
  useGetAdminPageAllAiCommandQuery,
  useAdminDeleteAiCommandMutation,
  useAdminAddAiCommandMutation,
  useAdminUpdateAiCommandMutation,
  useGetAiModelAllDataQuery,
  useAdminAddAiModelMutation,
  useAdminDeleteAiModelMutation,
  useAdminUpdateAiModelMutation,
  useAdminAddAiModelTrainedMutation,
  useGetAiModelTrainedAllDataQuery,
  useAdminDeleteAiModelRowTrainedDataMutation,
  useAdminDeleteAiModelAllTrainedDataMutation,
  useGetAIFineTuneModelQuery,
  useGetAIChatSessionListQuery,
  useAddNewAIChatSessionMutation,
  useUpdateAIChatSessionMutation,
  useUpdateCustomizeImgCommandMutation,
  useUpdateAIChatMsgInfoMutation,
  useGetAllTeamsAiCommandQuery,
  useTeamsAddAiCommandMutation,
  useTeamsDeleteAiCommandMutation,
  useTeamsUpdateAiCommandMutation,
  useTeamsAddManyAiCommandMutation,
  useSaveBoardAiContextContentMutation,
  useGetBoardAiContextContentQuery,
  useSaveRoomAiContextContentMutation,
  useGetRoomAiContextContentQuery,
  useSaveTeamAiContextContentMutation,
  useGetTeamAiContextContentQuery,
  useGetAllAiAgentListQuery,
  useAddAiAgentMutation,
  useDeleteAiAgentMutation,
  useUpdateAiAgentMutation,
  useGetMyAgentListQuery
} = AiAssistApi;
