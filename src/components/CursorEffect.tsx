import { useEffect, useState } from "react"

export default function CursorEffect() {
  const [cursor, setCursor] = useState({ x: 0, y: 0 })
  const [cursorLag, setCursorLag] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      setCursor({ x: e.pageX, y: e.pageY })
    }

    window.addEventListener('mousemove', moveCursor)
    return () => window.removeEventListener('mousemove', moveCursor)
  }, [])

  useEffect(() => {
    let animationFrameId: number

    const updateLaggedCursor = () => {
      setCursorLag((prevLag) => {
        const dx = cursor.x - prevLag.x
        const dy = cursor.y - prevLag.y
        const lagSpeed = 0.1

        const newX = prevLag.x + dx * lagSpeed
        const newY = prevLag.y + dy * lagSpeed

        if (Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1) {
          animationFrameId = requestAnimationFrame(updateLaggedCursor)
        }

        return { x: newX, y: newY }
      })
    }

    animationFrameId = requestAnimationFrame(updateLaggedCursor)

    return () => cancelAnimationFrame(animationFrameId)
  }, [cursor])

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-[9999]">
      <div
        className="absolute w-1.5 h-1.5 bg-white rounded-full"
        style={{
          top: `${cursor.y}px`,
          left: `${cursor.x}px`,
          transform: 'translate(-50%, -50%)',
        }}
      />
      <div
        className="absolute border-2 border-white rounded-full p-3"
        style={{
          top: `${cursorLag.y}px`,
          left: `${cursorLag.x}px`,
          transform: 'translate(-50%, -50%)',
        }}
      />
    </div>
  )
}

