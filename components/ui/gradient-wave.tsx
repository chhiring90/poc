"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { motion } from "motion/react";
import {
  DEFAULT_COLORS,
  FRAGMENT_SHADER,
  VERTEX_SHADER,
  hexToRgb01,
} from "./gradient-wave-shaders";
import {
  GradientWaveContent,
  type GradientWaveContentProps,
} from "./gradient-wave-content";

type GradientWaveProps = GradientWaveContentProps & {
  /** Overall animation speed multiplier. 1 = default. */
  speed?: number;
  /**
   * Five hex colors controlling the gradient, in order:
   * [base, first blend stop, second blend stop, highlight, streak accent].
   * Falls back to the default sunset palette if omitted or if fewer than 5
   * are provided.
   */
  colors?: string[];
  /** Extra Tailwind classes for the outer rounded container. */
  className?: string;
  /** Set to false to render the bare gradient with no text overlay. */
  showContent?: boolean;
};

export function GradientWave({
  speed = 1,
  colors,
  className = "",
  showContent = true,
  ...contentProps
}: GradientWaveProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const uniformsRef = useRef<{
    uTime: { value: number };
    uResolution: { value: THREE.Vector2 };
    uSpeed: { value: number };
    uColors: { value: THREE.Vector3[] };
  } | null>(null);

  const resolvedColors =
    colors && colors.length >= 5 ? colors.slice(0, 5) : DEFAULT_COLORS;

  // Update color uniforms in place when the `colors` prop changes,
  // without tearing down the WebGL context.
  useEffect(() => {
    const uniforms = uniformsRef.current;
    if (!uniforms) return;
    resolvedColors.forEach((hex, i) => {
      const [r, g, b] = hexToRgb01(hex);
      uniforms.uColors.value[i].set(r, g, b);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(resolvedColors)]);

  // Keep speed uniform live too, without a full remount.
  useEffect(() => {
    const uniforms = uniformsRef.current;
    if (!uniforms) return;
    uniforms.uSpeed.value = speed;
  }, [speed]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.Camera();
    camera.position.z = 1;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    const geometry = new THREE.PlaneGeometry(2, 2);
    const uniforms = {
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uSpeed: { value: speed },
      uColors: {
        value: resolvedColors.map((hex) => {
          const [r, g, b] = hexToRgb01(hex);
          return new THREE.Vector3(r, g, b);
        }),
      },
    };
    uniformsRef.current = uniforms;

    const material = new THREE.ShaderMaterial({
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      uniforms,
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // reduced-motion: render one still frame and stop
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const resizeObserver = new ResizeObserver(() => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      renderer.setSize(w, h);
      uniforms.uResolution.value.set(w, h);
      // In reduced-motion there is no rAF loop, so redraw the still frame
      // after each resize.
      if (prefersReducedMotion) renderer.render(scene, camera);
    });
    resizeObserver.observe(mount);

    let raf = 0;
    const start = performance.now();
    function animate() {
      const elapsed = (performance.now() - start) / 1000;
      uniforms.uTime.value = elapsed;
      renderer.render(scene, camera);
      if (!prefersReducedMotion) {
        raf = requestAnimationFrame(animate);
      }
    }
    animate();

    return () => {
      if (raf) cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      mount.removeChild(renderer.domElement);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      uniformsRef.current = null;
    };
    // Mount effect only runs once; color/speed updates are handled by the
    // effects above so we don't tear down and rebuild the WebGL context
    // on every prop change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
      className={`relative overflow-hidden rounded-3xl ${className}`}
    >
      {/* WebGL canvas fills the card */}
      <div ref={mountRef} className="absolute inset-0 [&>canvas]:block" />

      {showContent && <GradientWaveContent {...contentProps} />}
    </motion.div>
  );
}
