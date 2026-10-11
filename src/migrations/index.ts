import * as migration_20261010_235921_initial from './20261010_235921_initial';

export const migrations = [
  {
    up: migration_20261010_235921_initial.up,
    down: migration_20261010_235921_initial.down,
    name: '20261010_235921_initial'
  },
];
