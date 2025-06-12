// PointerLockControls.js - ES module version for Three.js

import {
    EventDispatcher,
    Vector3,
    Euler
  } from 'three';
  
  class PointerLockControls extends EventDispatcher {
    constructor(camera, domElement) {
      super();
  
      this.domElement = domElement;
      this.isLocked = false;
  
      const scope = this;
  
      const changeEvent = { type: 'change' };
      const lockEvent = { type: 'lock' };
      const unlockEvent = { type: 'unlock' };
  
      const euler = new Euler(0, 0, 0, 'YXZ');
      const PI_2 = Math.PI / 2;
      const vec = new Vector3();
  
      function onMouseMove(event) {
        if (!scope.isLocked) return;
  
        const movementX = event.movementX || 0;
        const movementY = event.movementY || 0;
  
        euler.setFromQuaternion(camera.quaternion);
  
        euler.y -= movementX * 0.002;
        euler.x -= movementY * 0.002;
  
        // Limit vertical look to avoid flipping
        euler.x = Math.max(-PI_2, Math.min(PI_2, euler.x));
  
        camera.quaternion.setFromEuler(euler);
  
        scope.dispatchEvent(changeEvent);
      }
  
      function onPointerlockChange() {
        if (document.pointerLockElement === scope.domElement) {
          scope.dispatchEvent(lockEvent);
          scope.isLocked = true;
        } else {
          scope.dispatchEvent(unlockEvent);
          scope.isLocked = false;
        }
      }
  
      function onPointerlockError() {
        console.error('PointerLockControls: Unable to use Pointer Lock API');
      }
  
      this.connect = function () {
        document.addEventListener('mousemove', onMouseMove, false);
        document.addEventListener('pointerlockchange', onPointerlockChange, false);
        document.addEventListener('pointerlockerror', onPointerlockError, false);
      };
  
      this.disconnect = function () {
        document.removeEventListener('mousemove', onMouseMove, false);
        document.removeEventListener('pointerlockchange', onPointerlockChange, false);
        document.removeEventListener('pointerlockerror', onPointerlockError, false);
      };
  
      this.dispose = function () {
        this.disconnect();
      };
  
      this.getObject = function () {
        return camera;
      };
  
      this.lock = function () {
        this.domElement.requestPointerLock();
      };
  
      this.unlock = function () {
        document.exitPointerLock();
      };
  
      // Move forward/backward relative to camera direction
      this.moveForward = function (distance) {
        vec.setFromMatrixColumn(camera.matrix, 0);
        vec.crossVectors(camera.up, vec);
        camera.position.addScaledVector(vec, distance);
      };
  
      // Move right/left relative to camera direction
      this.moveRight = function (distance) {
        vec.setFromMatrixColumn(camera.matrix, 0);
        camera.position.addScaledVector(vec, distance);
      };
  
      this.connect();
    }
  }
  
  export { PointerLockControls };
  