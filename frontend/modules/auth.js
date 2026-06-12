/**
 * Authentication & Security Module
 * User authentication and role management
 */

import { getFirebaseServices } from '../services/firebase.js';
import stateManager from '../state/stateManager.js';
import logger from './logger.js';
import storage from './storage.js';

// Valid roles in the system
const VALID_ROLES = {
  ADMIN: 'admin',
  VENDOR: 'vendor',
  CLIENT: 'client'
};

// Role aliases for normalization
const ROLE_ALIASES = {
  'administrator': 'admin',
  'administrateur': 'admin',
  'adm': 'admin',
  'vendeur': 'vendor',
  'seller': 'vendor',
  'marchand': 'vendor',
  'commerçant': 'vendor',
  'customer': 'client',
  'utilisateur': 'client',
  'user': 'client',
  'clientèle': 'client'
};

/**
 * Normalize role string
 */
function normalizeRole(rawRole) {
  if (!rawRole) return VALID_ROLES.CLIENT;

  const normalized = String(rawRole).trim().toLowerCase();
  
  // Direct match
  if (Object.values(VALID_ROLES).includes(normalized)) {
    return normalized;
  }

  // Alias match
  const aliased = ROLE_ALIASES[normalized];
  if (aliased) {
    return aliased;
  }

  logger.warn('⚠️ Unknown role detected', { rawRole, normalized });
  return VALID_ROLES.CLIENT; // Safe default
}

/**
 * Validate role
 */
function isValidRole(role) {
  return Object.values(VALID_ROLES).includes(role);
}

/**
 * Get user role from Firestore
 */
async function getUserRole(uid) {
  if (!uid) {
    logger.warn('⚠️ UID missing for role retrieval');
    return VALID_ROLES.CLIENT;
  }

  try {
    const { db } = getFirebaseServices();
    const userDoc = await db.collection('users').doc(uid).get();

    if (!userDoc.exists) {
      logger.info('ℹ️ User document not found, will create on next update');
      return VALID_ROLES.CLIENT;
    }

    const userData = userDoc.data();
    if (!userData) {
      logger.warn('⚠️ Empty user data');
      return VALID_ROLES.CLIENT;
    }

    // Try multiple role field names for compatibility
    const rawRole = userData.role || 
                   userData.userType || 
                   userData.user_type || 
                   userData.type || 
                   userData.roleType;

    if (!rawRole) {
      logger.warn('⚠️ No role field found for user', { uid });
      return VALID_ROLES.CLIENT;
    }

    const normalizedRole = normalizeRole(rawRole);

    // Update Firestore if role was changed
    if (userData.role !== normalizedRole) {
      logger.info('🔄 Updating role in Firestore', {
        from: userData.role,
        to: normalizedRole
      });
      await db.collection('users').doc(uid).set({
        role: normalizedRole,
        roleUpdatedAt: new Date()
      }, { merge: true });
    }

    return normalizedRole;
  } catch (error) {
    logger.error('❌ Failed to get user role', error);
    return VALID_ROLES.CLIENT;
  }
}

/**
 * Update user role (admin only)
 */
async function updateUserRole(targetUid, newRole, adminUid) {
  try {
    const { db } = getFirebaseServices();
    const adminRole = await getUserRole(adminUid);

    // Only admins can update roles
    if (adminRole !== VALID_ROLES.ADMIN) {
      throw new Error('Unauthorized: Only admins can update roles');
    }

    // Validate new role
    if (!isValidRole(newRole)) {
      throw new Error(`Invalid role: ${newRole}`);
    }

    await db.collection('users').doc(targetUid).set({
      role: newRole,
      roleUpdatedAt: new Date(),
      roleUpdatedBy: adminUid
    }, { merge: true });

    logger.success('✅ User role updated successfully', {
      targetUid,
      newRole
    });

    return true;
  } catch (error) {
    logger.error('❌ Failed to update user role', error);
    throw error;
  }
}

/**
 * Check if user has permission
 */
function hasPermission(userRole, requiredRole) {
  // Admin has all permissions
  if (userRole === VALID_ROLES.ADMIN) return true;

  // Vendors can do client actions
  if (userRole === VALID_ROLES.VENDOR && requiredRole === VALID_ROLES.CLIENT) {
    return true;
  }

  return userRole === requiredRole;
}

/**
 * Apply role-based visibility
 */
function applyRoleBasedVisibility() {
  const state = stateManager.getState();
  const { currentUser, userRole, isAdmin } = state;

  // Update visibility for role-based elements
  const adminEls = document.querySelectorAll('[data-role="admin"]');
  const vendorEls = document.querySelectorAll('[data-role="vendor"]');
  const clientEls = document.querySelectorAll('[data-role="client"]');

  adminEls.forEach(el => {
    el.style.display = isAdmin ? '' : 'none';
  });

  vendorEls.forEach(el => {
    el.style.display = (userRole === 'vendor' || isAdmin) ? '' : 'none';
  });

  clientEls.forEach(el => {
    el.style.display = (currentUser && !isAdmin) ? '' : 'none';
  });

  logger.debug('Role-based visibility applied', { userRole, isAdmin });
}

export {
  VALID_ROLES,
  normalizeRole,
  isValidRole,
  getUserRole,
  updateUserRole,
  hasPermission,
  applyRoleBasedVisibility
};
