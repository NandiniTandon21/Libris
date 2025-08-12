import * as React from "react"
import { X } from "lucide-react"
import { Button } from "./button"

interface DialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
}

interface DialogContentProps {
  children: React.ReactNode
  className?: string
}

interface DialogTriggerProps {
  asChild?: boolean
  children: React.ReactNode
}

const Dialog: React.FC<DialogProps> = ({ open, onOpenChange, children }) => {
  return (
    <div className={`fixed inset-0 z-50 ${open ? 'block' : 'hidden'}`}>
      <div
        className="fixed inset-0 bg-black/50"
        onClick={() => onOpenChange?.(false)}
      />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        {children}
      </div>
    </div>
  )
}

const DialogTrigger: React.FC<DialogTriggerProps> = ({ children, asChild }) => {
  if (asChild) {
    return React.cloneElement(children as React.ReactElement, {})
  }
  return <>{children}</>
}

const DialogContent: React.FC<DialogContentProps> = ({ children, className = "" }) => {
  return (
    <div className={`bg-white rounded-lg shadow-lg max-w-md w-full mx-auto p-6 relative ${className}`}>
      {children}
    </div>
  )
}

const DialogHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div className="mb-4">{children}</div>
}

const DialogTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <h2 className="text-lg font-semibold text-gray-900">{children}</h2>
}

const DialogDescription: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <p className="text-sm text-gray-600 mt-1">{children}</p>
}

const DialogFooter: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div className="flex justify-end space-x-2 mt-6">{children}</div>
}

export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
}