using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Windows.Forms;
using System.Runtime.InteropServices;

namespace CPower_CSharp
{
    public partial class Form1 : Form
    {
        private byte m_nPort = 0;
        private int m_nBaudrate = 0;
        private int m_nTimeout = 0;
        private int m_nCardID = 0;
        private byte m_nCommType = 0;
        private int m_nIPPort = 0;
        private uint m_dwIPAddr = 0;
        private uint m_dwIDCode = 0;
        private int m_nWidth = 0;
        private int m_nHeight = 0;
        private long[] m_baudtbl = new long[6] { 115200, 57600, 38400, 19200, 9600, 4800 };


        public Form1()
        {
            InitializeComponent();
        }

        private uint GetIP(string strIp)
        {
            System.Net.IPAddress ipaddress = System.Net.IPAddress.Parse(strIp);
            uint lIp = (uint)ipaddress.Address;
            //调整IP地址的字节序
            lIp = ((lIp & 0xFF000000) >> 24) + ((lIp & 0x00FF0000) >> 8) + ((lIp & 0x0000FF00) << 8) + ((lIp & 0x000000FF) << 24);
            return (lIp);
        }

        private int InitComm()
        {
            int nRet = 0;
            string strPort;
            if (0 == m_nCommType)
            {
                strPort = "COM" + m_nPort.ToString();
                nRet = CP5200.CP5200_RS232_InitEx(Marshal.StringToHGlobalAnsi(strPort), m_nBaudrate, m_nTimeout);
            }
            else
            {
                m_dwIPAddr = GetIP(IPAddr.Text);
                if (0 != m_dwIPAddr)
                {
                    m_dwIDCode = GetIP(IDCode.Text);
                    if (0 != m_dwIDCode)
                    {
                        CP5200.CP5200_Net_Init(m_dwIPAddr, m_nIPPort, m_dwIDCode, m_nTimeout);
                        nRet = 1;
                    }
                }

            }

            return nRet;
        }

        private void btnSplitWnd_Click(object sender, EventArgs e)
        {
            int ret = 0;
            int[] nWndRect = new int[4];
            m_nWidth = Convert.ToInt32(m_edtWidth.Text);
            m_nHeight = Convert.ToInt32(m_edtHeight.Text);
            nWndRect[0] = 0;
            nWndRect[1] = 0;
            nWndRect[2] = m_nWidth;
            nWndRect[3] = m_nHeight;

            if (1 == InitComm())
            {
                if (0 == m_nCommType) 
                {
                    ret = CP5200.CP5200_RS232_SplitScreen(m_nCardID, m_nWidth, m_nHeight, 1,  nWndRect);
                }
                else 
                {
                    ret = CP5200.CP5200_Net_SplitScreen(m_nCardID, m_nWidth, m_nHeight, 1, nWndRect);
                }

                if( ret >= 0 )
                {
                    MessageBox.Show("Successful");
                }
                else
                {
                    MessageBox.Show("Fail");
                }
            }
        }

        private void Form1_Load(object sender, EventArgs e)
        {
            string strTemp;
            int i;
            for (i = 1; i <= 16; i++)
            {
                strTemp = "COM" + i.ToString();
                m_cmbPort.Items.Add(strTemp);
            }

            for (i = 1; i <= 20; i++)
            {
                strTemp = i.ToString();
                m_cmbID.Items.Add(strTemp);
            }

            m_nPort = 1;
            m_nBaudrate = 115200;
            m_nTimeout = 600;
            m_nCardID = 1;
            m_nWidth = 64;
            m_nHeight = 32;

            m_nCommType = 0;
            m_nIPPort = 5200;
            m_dwIPAddr = 3232235876;
            m_dwIDCode = 4294967295;// -1;

            IPPort.Text = m_nIPPort.ToString();
            m_cmbID.SelectedIndex = m_nCardID - 1;
            m_cmbPort.SelectedIndex = m_nPort - 1;

            for (i = 0; i <= 5; i++)
            {
                if (m_nBaudrate == Convert.ToInt32(m_baudtbl[i]))
                {
                    m_cmbBaudrate.SelectedIndex = i;
                }
            }

            if (m_nCommType == 0)
            {
                RadioBtnCom.Checked = true;
                RadioBtnNetWork.Checked = false;
            }
            else
            {
                RadioBtnCom.Checked = false;
                RadioBtnNetWork.Checked = true;
            }
        }

        private void m_cmbPort_SelectedIndexChanged(object sender, EventArgs e)
        {
            m_nPort = Convert.ToByte(m_cmbPort.SelectedIndex + 1);
        }

        private void m_cmbBaudrate_SelectedIndexChanged(object sender, EventArgs e)
        {
            m_nBaudrate = Convert.ToInt32(m_baudtbl[m_cmbBaudrate.SelectedIndex]);
        }

        private void m_cmbID_SelectedIndexChanged(object sender, EventArgs e)
        {
            m_nCardID = Convert.ToInt32(m_cmbID.SelectedIndex + 1);
        }

        private void EnableCtrl()
        {
            bool bTure = true;
            if( m_nCommType == 0 )
            {
                bTure = false;
            }
            m_cmbPort.Enabled = (!bTure);
            m_cmbBaudrate.Enabled = (!bTure);

            IPAddr.Enabled = bTure;
            IPPort.Enabled = bTure;
            IDCode.Enabled = bTure;
        }

        private void RadioBtnCom_CheckedChanged(object sender, EventArgs e)
        {
            m_nCommType = 0;
            EnableCtrl();
        }

        private void RadioBtnNetWork_CheckedChanged(object sender, EventArgs e)
        {
            m_nCommType = 1;
            EnableCtrl();
        }

        private void IPPort_TextChanged(object sender, EventArgs e)
        {
            m_nIPPort = Convert.ToInt32(IPPort.Text);
        }

        private void btnSendText_Click(object sender, EventArgs e)
        {
            int ret = 0;
            int icolor = 3000;
            m_nWidth = Convert.ToInt32(m_edtWidth.Text);
            m_nHeight = Convert.ToInt32(m_edtHeight.Text);
            IntPtr iPtr = Marshal.StringToHGlobalAnsi(m_edtText.Text);
            if (1 == InitComm())
            {
                if (0 == m_nCommType)
                {
                    ret = CP5200.CP5200_RS232_SendText(m_nCardID, 0, iPtr, icolor, 16, 3, 0, 3, 0);
                }
                else
                {
                    ret = CP5200.CP5200_Net_SendTagText(m_nCardID, 0, iPtr, icolor, 16, 3, 0, 3, 0);
                }

                if (0 <= ret)
                {
                    MessageBox.Show("Successful");
                }
                else
                {
                    MessageBox.Show("Fail");
                }
            }
        }

        private void btnSendPicture_Click(object sender, EventArgs e)
        {
            int ret = 0;
            m_nWidth = Convert.ToInt32(m_edtWidth.Text);
            m_nHeight = Convert.ToInt32(m_edtHeight.Text);
            if (1 == InitComm())
            {
                if (0 == m_nCommType)
                {
                    ret = CP5200.CP5200_RS232_SendPicture(m_nCardID, 0, 0, 0, m_nWidth, m_nHeight, Marshal.StringToHGlobalAnsi(m_edtPicture.Text), 1, 0, 3, 0);
                }
                else
                {
                    ret = CP5200.CP5200_Net_SendPicture(m_nCardID, 0, 0, 0, m_nWidth, m_nHeight, Marshal.StringToHGlobalAnsi(m_edtPicture.Text), 1, 0, 3, 0);
                }

                if (0 <= ret)
                {
                    MessageBox.Show("Successful");
                }
                else
                {
                    MessageBox.Show("Fail");
                }
            }
        }

        private void btnSendStaticText_Click(object sender, EventArgs e)
        {
            int ret = 0;
            m_nWidth = Convert.ToInt32(m_edtWidth.Text);
            m_nHeight = Convert.ToInt32(m_edtHeight.Text);
            if (1 == InitComm())
            {
                if (0 == m_nCommType)
                {
                    ret = CP5200.CP5200_RS232_SendStatic(m_nCardID, 0, Marshal.StringToHGlobalAnsi(m_edtStaticText.Text), Color.FromArgb(255, 0, 0).ToArgb(), 16, 0, 0, 0, m_nWidth, m_nHeight);
                }
                else
                {
                    ret = CP5200.CP5200_Net_SendStatic(m_nCardID, 0, Marshal.StringToHGlobalAnsi(m_edtStaticText.Text), Color.FromArgb(255, 0, 0).ToArgb(), 16, 0, 0, 0, m_nWidth, m_nHeight);
                }

                if (0 <= ret)
                {
                    MessageBox.Show("Successful");
                }
                else
                {
                    MessageBox.Show("Fail");
                }
            }
        }

        private void btnSendClock_Click(object sender, EventArgs e)
        {
            int ret = 0;
            m_nWidth = Convert.ToInt32(m_edtWidth.Text);
            m_nHeight = Convert.ToInt32(m_edtHeight.Text);
            if (1 == InitComm())
            {
                if (0 == m_nCommType)
                {
                    ret = CP5200.CP5200_RS232_SendClock(m_nCardID, 0, 3, 0, 7, 7, 1, 255, 255, 255, Marshal.StringToHGlobalAnsi("Date"));
                }
                else
                {
                    ret = CP5200.CP5200_Net_SendClock(m_nCardID, 0, 3, 0, 7, 7, 1, 255, 255, 255, Marshal.StringToHGlobalAnsi("Date"));
                }

                if (0 <= ret)
                {
                    MessageBox.Show("Successful");
                }
                else
                {
                    MessageBox.Show("Fail");
                }
            }
        }

    
        private void btnSetTime_Click(object sender, EventArgs e)
        {
            int ret = 0;
            byte[] byTime = new byte[7];
            DateTime curTime;

            curTime = DateTime.Now; 
            byTime[0] = Convert.ToByte(curTime.Second);
            byTime[1] = Convert.ToByte(curTime.Minute);
            byTime[2] = Convert.ToByte(curTime.Hour);
            byTime[3] = Convert.ToByte(curTime.DayOfWeek);
            byTime[4] = Convert.ToByte(curTime.Day);
            byTime[5] = Convert.ToByte(curTime.Month);
            byTime[6] = Convert.ToByte(curTime.Year - 2000);

            if (1 == InitComm())
            {
                if (0 == m_nCommType)
                {
                    ret = CP5200.CP5200_RS232_SetTime(Convert.ToByte(m_nCardID), byTime);
                }
                else
                {
                    ret = CP5200.CP5200_Net_SetTime(Convert.ToByte(m_nCardID), byTime);
                }

                if (0 <= ret)
                {
                    MessageBox.Show("Successful");
                }
                else
                {
                    MessageBox.Show("Fail");
                }
            }
        }

        private void btnPlayOneProgram_Click(object sender, EventArgs e)
        {
            int ret = 0;
            int[] strPrg = new int[256];
            strPrg[0] = Convert.ToInt32( m_edtSelProgram.Text);
            strPrg[1] = 0;

            if (1 == InitComm())
            {
                if (0 == m_nCommType)
                {
                    ret = CP5200.CP5200_RS232_PlaySelectedPrg(m_nCardID, strPrg, 1, 0);
                }
                else
                {
                    ret = CP5200.CP5200_Net_PlaySelectedPrg(m_nCardID, strPrg, 1, 0);
                }

                if (0 <= ret)
                {
                    MessageBox.Show("Successful");
                }
                else
                {
                    MessageBox.Show("Fail");
                }
            }
        }

        private void m_edtWidth_ModifiedChanged(object sender, EventArgs e)
        {

        }

        private void m_edtHeight_ModifiedChanged(object sender, EventArgs e)

        {
            
        }
    }
}
