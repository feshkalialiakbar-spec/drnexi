import SelectWallet from '@/components/SelectWallet'
import AuthLayout from '@/layouts/AuthLayout'

const SelectWalletPage = () => {
  return (
    <AuthLayout>
      <SelectWallet autoRedirect={true} />
    </AuthLayout>
  )
}

export default SelectWalletPage
