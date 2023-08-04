import { mergeTypeDefs } from '@graphql-tools/merge';
import { loadFilesSync } from '@graphql-tools/load-files';
import path from 'path';

const schemaFolder = path.join(__dirname, '.');

const loadedTypeDefs = loadFilesSync(schemaFolder, { extensions: ['graphql'] });

const mergedTypeDefs = mergeTypeDefs(loadedTypeDefs);

export default mergedTypeDefs;