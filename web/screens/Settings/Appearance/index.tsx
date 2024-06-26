import { useCallback } from 'react'

import { useTheme } from 'next-themes'

import { fs, joinPath } from '@janhq/core'
import { Button, Select } from '@janhq/joi'
import { useAtom, useAtomValue } from 'jotai'

import {
  janThemesPathAtom,
  reduceTransparentAtom,
  selectedThemeIdAtom,
  themeDataAtom,
  themesOptionsAtom,
} from '@/helpers/atoms/Setting.atom'

export default function AppearanceOptions() {
  const [selectedIdTheme, setSelectedIdTheme] = useAtom(selectedThemeIdAtom)
  const themeOptions = useAtomValue(themesOptionsAtom)
  const { setTheme } = useTheme()
  const janThemesPath = useAtomValue(janThemesPathAtom)
  const [themeData, setThemeData] = useAtom(themeDataAtom)
  const [reduceTransparent, setReduceTransparent] = useAtom(
    reduceTransparentAtom
  )

  const handleClickTheme = useCallback(
    async (e: string) => {
      setSelectedIdTheme(e)
      const filePath = await joinPath([`${janThemesPath}/${e}`, `theme.json`])
      const theme: Theme = JSON.parse(await fs.readFileSync(filePath, 'utf-8'))
      setThemeData(theme)
      setTheme(String(theme?.nativeTheme))
      if (theme?.reduceTransparent) {
        setReduceTransparent(reduceTransparent)
      } else {
        setReduceTransparent(true)
      }
    },
    [
      janThemesPath,
      reduceTransparent,
      setReduceTransparent,
      setSelectedIdTheme,
      setTheme,
      setThemeData,
    ]
  )

  return (
    <div className="m-4 block">
      <div className="flex w-full flex-col items-start justify-between gap-4 border-b border-[hsla(var(--app-border))] py-4 first:pt-0 last:border-none sm:flex-row">
        <div className="flex-shrink-0 space-y-1">
          <div className="flex gap-x-2">
            <h6 className="font-semibold capitalize">Appearance</h6>
          </div>
          <p className="font-medium leading-relaxed text-[hsla(var(--text-secondary))]">
            Select of customize your interface color scheme
          </p>
        </div>
        <Select
          value={selectedIdTheme}
          options={themeOptions}
          onValueChange={(e) => handleClickTheme(e)}
        />
      </div>
      {themeData?.reduceTransparent && (
        <div className="flex w-full flex-col items-start justify-between gap-4 border-b border-[hsla(var(--app-border))] py-4 first:pt-0 last:border-none sm:flex-row">
          <div className="flex-shrink-0 space-y-1">
            <div className="flex gap-x-2">
              <h6 className="font-semibold capitalize">Interface theme</h6>
            </div>
            <p className="font-medium leading-relaxed text-[hsla(var(--text-secondary))]">
              Choose the type of the interface
            </p>
          </div>
          <div className="flex items-center gap-x-2">
            <Button
              theme={reduceTransparent ? 'primary' : 'ghost'}
              variant={reduceTransparent ? 'solid' : 'outline'}
              onClick={() => setReduceTransparent(true)}
            >
              Solid
            </Button>
            <Button
              theme={reduceTransparent ? 'ghost' : 'primary'}
              variant={reduceTransparent ? 'outline' : 'solid'}
              onClick={() => setReduceTransparent(false)}
            >
              Transparent
            </Button>
          </div>
          {/* <Switch
            checked={reduceTransparent}
            onChange={(e) => setReduceTransparent(e.target.checked)}
          /> */}
        </div>
      )}
    </div>
  )
}
