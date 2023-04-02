"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
exports.__esModule = true;
exports.getResolveRequest = void 0;
var metroResolver = require("metro-resolver");
var tsconfig_paths_1 = require("tsconfig-paths");
var chalk = require("chalk");
var enhanced_resolve_1 = require("enhanced-resolve");
var path_1 = require("path");
var fs = require("fs");
var devkit_1 = require("@nrwl/devkit");
/*
 * Use tsconfig to resolve additional workspace libs.
 *
 * This resolve function requires projectRoot to be set to
 * workspace root in order modules and assets to be registered and watched.
 */
function getResolveRequest(extensions) {
    return function (_context, realModuleName, platform) {
        var debug = process.env.NX_REACT_NATIVE_DEBUG === 'true';
        if (debug)
            console.log(chalk.cyan("[Nx] Resolving: ".concat(realModuleName)));
        var resolveRequest = _context.resolveRequest, context = __rest(_context, ["resolveRequest"]);
        var resolvedPath = resolveRequestFromContext(resolveRequest, _context, realModuleName, platform, debug) ||
            defaultMetroResolver(context, realModuleName, platform, debug) ||
            tsconfigPathsResolver(context, extensions, realModuleName, platform, debug) ||
            pnpmResolver(extensions, context, realModuleName, debug);
        if (resolvedPath) {
            return resolvedPath;
        }
        throw new Error("Cannot resolve ".concat(chalk.bold(realModuleName)));
    };
}
exports.getResolveRequest = getResolveRequest;
function resolveRequestFromContext(resolveRequest, context, realModuleName, platform, debug) {
    try {
        return resolveRequest(context, realModuleName, platform);
    }
    catch (_a) {
        if (debug)
            console.log(chalk.cyan("[Nx] Unable to resolve with default resolveRequest: ".concat(realModuleName)));
    }
}
/**
 * This function try to resolve path using metro's default resolver
 * @returns path if resolved, else undefined
 */
function defaultMetroResolver(context, realModuleName, platform, debug) {
    try {
        return metroResolver.resolve(context, realModuleName, platform);
    }
    catch (_a) {
        if (debug)
            console.log(chalk.cyan("[Nx] Unable to resolve with default Metro resolver: ".concat(realModuleName)));
    }
}
/**
 * This resolver try to resolve module for pnpm.
 * @returns path if resolved, else undefined
 * This pnpm resolver is inspired from https://github.com/vjpr/pnpm-react-native-example/blob/main/packages/pnpm-expo-helper/util/make-resolver.js
 */
function pnpmResolver(extensions, context, realModuleName, debug) {
    try {
        var pnpmResolve = getPnpmResolver(extensions);
        var lookupStartPath = (0, path_1.dirname)(context.originModulePath);
        var filePath = pnpmResolve.resolveSync({}, lookupStartPath, realModuleName);
        if (filePath) {
            return { type: 'sourceFile', filePath: filePath };
        }
    }
    catch (_a) {
        if (debug)
            console.log(chalk.cyan("[Nx] Unable to resolve with default PNPM resolver: ".concat(realModuleName)));
    }
}
/**
 * This function try to resolve files that are specified in tsconfig's paths
 * @returns path if resolved, else undefined
 */
function tsconfigPathsResolver(context, extensions, realModuleName, platform, debug) {
    var tsConfigPathMatcher = getMatcher(debug);
    var match = tsConfigPathMatcher(realModuleName, undefined, undefined, extensions.map(function (ext) { return ".".concat(ext); }));
    if (match) {
        return metroResolver.resolve(context, match, platform);
    }
    else {
        if (debug) {
            console.log(chalk.red("[Nx] Failed to resolve ".concat(chalk.bold(realModuleName))));
            console.log(chalk.cyan("[Nx] The following tsconfig paths was used:\n:".concat(chalk.bold(JSON.stringify(paths, null, 2)))));
        }
    }
}
var matcher;
var absoluteBaseUrl;
var paths;
function getMatcher(debug) {
    if (!matcher) {
        var result = (0, tsconfig_paths_1.loadConfig)();
        if (result.resultType === 'success') {
            absoluteBaseUrl = result.absoluteBaseUrl;
            paths = result.paths;
            if (debug) {
                console.log(chalk.cyan("[Nx] Located tsconfig at ".concat(chalk.bold(absoluteBaseUrl))));
                console.log(chalk.cyan("[Nx] Found the following paths:\n:".concat(chalk.bold(JSON.stringify(paths, null, 2)))));
            }
            matcher = (0, tsconfig_paths_1.createMatchPath)(absoluteBaseUrl, paths);
        }
        else {
            console.log(chalk.cyan("[Nx] Failed to locate tsconfig}"));
            throw new Error("Could not load tsconfig for project");
        }
    }
    return matcher;
}
/**
 * This function returns resolver for pnpm.
 * It is inspired form https://github.com/vjpr/pnpm-expo-example/blob/main/packages/pnpm-expo-helper/util/make-resolver.js.
 */
var resolver;
function getPnpmResolver(extensions) {
    if (!resolver) {
        var fileSystem = new enhanced_resolve_1.CachedInputFileSystem(fs, 4000);
        resolver = enhanced_resolve_1.ResolverFactory.createResolver({
            fileSystem: fileSystem,
            extensions: extensions.map(function (extension) { return '.' + extension; }),
            useSyncFileSystemCalls: true,
            modules: [
                (0, path_1.join)(devkit_1.workspaceRoot, 'node_modules'),
                (0, path_1.join)('..', 'node_modules'),
            ],
            conditionNames: ['native', 'browser', 'require', 'default'],
            mainFields: ['react-native', 'browser', 'main'],
            aliasFields: ['browser']
        });
    }
    return resolver;
}
