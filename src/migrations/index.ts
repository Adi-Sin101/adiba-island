import * as migration_20261010_235921_initial from './20261010_235921_initial';
import * as migration_20261011_001437_blob_fields from './20261011_001437_blob_fields';

export const migrations = [
  {
    up: migration_20261010_235921_initial.up,
    down: migration_20261010_235921_initial.down,
    name: '20261010_235921_initial',
  },
  {
    up: migration_20261011_001437_blob_fields.up,
    down: migration_20261011_001437_blob_fields.down,
    name: '20261011_001437_blob_fields'
  },
];
