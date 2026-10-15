/**
 * Environment isolation and restoration utilities for deterministic testing.
 */

/**
 * Captures a complete snapshot of current process.env keys and values.
 * Returns a restore() function that completely reverts process.env to the snapshot state,
 * restoring modified variables and deleting any variables added during test execution.
 */
export function createEnvSnapshot() {
  const initialKeys = Object.keys(process.env);
  const initialEnv = { ...process.env };

  return {
    restore() {
      // 1. Delete any newly added variables
      for (const key of Object.keys(process.env)) {
        if (!initialKeys.includes(key)) {
          delete process.env[key];
        }
      }

      // 2. Revert any modified or deleted initial variables
      for (const key of initialKeys) {
        if (initialEnv[key] === undefined) {
          delete process.env[key];
        } else {
          process.env[key] = initialEnv[key];
        }
      }
    },
  };
}

/**
 * Executes a synchronous or asynchronous test function with temporary environment variable overrides.
 * Guarantees that process.env is 100% restored to its previous state even if the callback throws an error.
 *
 * @param {Record<string, string | undefined>} overrides Key-value pairs to set in process.env (undefined deletes the variable)
 * @param {() => Promise<unknown> | unknown} fn Test function to execute
 * @returns {Promise<unknown>} Result of fn()
 */
export async function withIsolatedEnv(overrides, fn) {
  const snapshot = createEnvSnapshot();

  try {
    for (const [key, value] of Object.entries(overrides)) {
      if (value === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = String(value);
      }
    }

    return await fn();
  } finally {
    snapshot.restore();
  }
}
