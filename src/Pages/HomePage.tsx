import { useState } from 'react'
import { Upload, Github, Info, Database } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import DependencyViewPage from './DependencyViewPage'
import { demoDependencies } from '@/Utils/DependencyModel'

export default function HomePage() {
  const [file, setFile] = useState<File | null>(null)
  const [currentView, setCurrentView] = useState<'upload' | 'demo' | 'actual'>('upload')

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)

      handleViewChange('actual')
    }
  }

  const handleViewChange = (view: 'upload' | 'demo' | 'actual') => {
    setCurrentView(view)
  }

  const handleViewDemo = () => {
    if (currentView === 'demo') {
      setCurrentView('upload')
    } else {
      setCurrentView('demo')
    }
  }

  return (
    <div className="min-h-screen w-full bg-gray-100 dark:bg-gray-900 p-8 flex flex-col justify-between">
      {/* Container max width */}
      <div className="max-w-full mx-auto w-full flex flex-col flex-grow">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            NPM Dependency Viewer
          </h1>
          <div className="space-x-4">
            <Button variant="outline" onClick={() => handleViewDemo()}>
              {currentView === 'upload' ? (<Database className="mr-2 h-4 w-4" />) : (<Upload className="mr-2 h-4 w-4" />)}
              {currentView === 'upload' ? 'View Demo' : 'Upload package.json'}
            </Button>
            <Button onClick={() => window.open('https://github.com/tronnyg/dependency-visualizer', '_blank')}>
              <Github className="mr-2 h-4 w-4" />
              View Source
            </Button>
          </div>
        </header>

        {/* Card Centered Vertically and Horizontally */}
        <div className="flex flex-grow items-center justify-center">
          {currentView === 'upload' ? (
            <Card className="mb-8 max-w-6xl w-6/12">
              <CardHeader>
                <CardTitle>Upload package.json</CardTitle>
                <CardDescription>
                  Select your package.json file to view its dependencies
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <Input
                    type="file"
                    accept=".json"
                    onChange={handleFileChange}
                    className="flex-grow"
                  />
                  <Button disabled={!file}>
                    <Upload className="mr-2 h-4 w-4" />
                    Analyze
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="flex justify-center w-[95%] h-[95%] border-4 mb-5">
              <DependencyViewPage dependencies={demoDependencies} />
            </div>
          )}
        </div>

        {/* Footer at the bottom */}
        <footer className="text-center text-sm text-gray-500 dark:text-gray-400">
          <p>© 2023 NPM Dependency Viewer. All rights reserved.</p>
          <Button variant="link" className="mt-2">
            <Info className="mr-2 h-4 w-4" />
            About this project
          </Button>
        </footer>
      </div>
    </div>
  )
}
