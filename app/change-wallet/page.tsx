import SelectWallet from '@/components/SelectWallet'
import MainLayout from '@/layouts/MainLayout'

const SelectWalletPage = () => {
  return (
    <MainLayout>
      <SelectWallet autoRedirect={false} />
    </MainLayout>
  )
}

export default SelectWalletPage
