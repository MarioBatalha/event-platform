'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const withComponentRegistry = require('./withComponentRegistry-90ec334c.js');
const MediaType = require('./MediaType-8f0adf5d.js');
const PlayerDispatcher = require('./PlayerDispatcher-00dbedc9.js');
const PlayerProps = require('./PlayerProps-4bbfc16a.js');
const ViewType = require('./ViewType-ea1402c0.js');
const withPlayerContext = require('./withPlayerContext-77ea833f.js');
const Provider = require('./Provider-b6123cae.js');
require('./index-86498cbd.js');
require('./PlayerEvents-79156eee.js');



exports.COMPONENT_NAME_KEY = withComponentRegistry.COMPONENT_NAME_KEY;
exports.PLAYER_KEY = withComponentRegistry.PLAYER_KEY;
exports.REGISTRATION_KEY = withComponentRegistry.REGISTRATION_KEY;
exports.REGISTRY_KEY = withComponentRegistry.REGISTRY_KEY;
exports.findPlayer = withComponentRegistry.findPlayer;
exports.getComponentFromRegistry = withComponentRegistry.getComponentFromRegistry;
exports.getPlayerFromRegistry = withComponentRegistry.getPlayerFromRegistry;
exports.isComponentRegistered = withComponentRegistry.isComponentRegistered;
exports.watchComponentRegistry = withComponentRegistry.watchComponentRegistry;
exports.withComponentRegistry = withComponentRegistry.withComponentRegistry;
Object.defineProperty(exports, 'MediaType', {
	enumerable: true,
	get: function () {
		return MediaType.MediaType;
	}
});
exports.createDispatcher = PlayerDispatcher.createDispatcher;
exports.initialState = PlayerProps.initialState;
exports.isWritableProp = PlayerProps.isWritableProp;
Object.defineProperty(exports, 'ViewType', {
	enumerable: true,
	get: function () {
		return ViewType.ViewType;
	}
});
exports.usePlayerContext = withPlayerContext.usePlayerContext;
exports.withPlayerContext = withPlayerContext.withPlayerContext;
Object.defineProperty(exports, 'Provider', {
	enumerable: true,
	get: function () {
		return Provider.Provider;
	}
});
