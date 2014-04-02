namespace CPower_CSharp
{
    partial class Form1
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            this.RadioBtnCom = new System.Windows.Forms.RadioButton();
            this.RadioBtnNetWork = new System.Windows.Forms.RadioButton();
            this.btnSplitWnd = new System.Windows.Forms.Button();
            this.btnSendText = new System.Windows.Forms.Button();
            this.btnSendPicture = new System.Windows.Forms.Button();
            this.btnSendStaticText = new System.Windows.Forms.Button();
            this.btnSendClock = new System.Windows.Forms.Button();
            this.label1 = new System.Windows.Forms.Label();
            this.label2 = new System.Windows.Forms.Label();
            this.label3 = new System.Windows.Forms.Label();
            this.label4 = new System.Windows.Forms.Label();
            this.label5 = new System.Windows.Forms.Label();
            this.label6 = new System.Windows.Forms.Label();
            this.m_cmbPort = new System.Windows.Forms.ComboBox();
            this.m_cmbBaudrate = new System.Windows.Forms.ComboBox();
            this.m_cmbID = new System.Windows.Forms.ComboBox();
            this.IPAddr = new System.Windows.Forms.TextBox();
            this.IPPort = new System.Windows.Forms.TextBox();
            this.IDCode = new System.Windows.Forms.TextBox();
            this.m_edtText = new System.Windows.Forms.TextBox();
            this.m_edtPicture = new System.Windows.Forms.TextBox();
            this.m_edtStaticText = new System.Windows.Forms.TextBox();
            this.btnSetTime = new System.Windows.Forms.Button();
            this.m_edtWidth = new System.Windows.Forms.TextBox();
            this.label7 = new System.Windows.Forms.Label();
            this.label8 = new System.Windows.Forms.Label();
            this.m_edtHeight = new System.Windows.Forms.TextBox();
            this.btnPlayOneProgram = new System.Windows.Forms.Button();
            this.m_edtSelProgram = new System.Windows.Forms.TextBox();
            this.SuspendLayout();
            // 
            // RadioBtnCom
            // 
            this.RadioBtnCom.AutoSize = true;
            this.RadioBtnCom.Location = new System.Drawing.Point(8, 8);
            this.RadioBtnCom.Name = "RadioBtnCom";
            this.RadioBtnCom.Size = new System.Drawing.Size(77, 16);
            this.RadioBtnCom.TabIndex = 4;
            this.RadioBtnCom.Text = "RS232/485";
            this.RadioBtnCom.UseVisualStyleBackColor = true;
            this.RadioBtnCom.CheckedChanged += new System.EventHandler(this.RadioBtnCom_CheckedChanged);
            // 
            // RadioBtnNetWork
            // 
            this.RadioBtnNetWork.AutoSize = true;
            this.RadioBtnNetWork.Location = new System.Drawing.Point(8, 48);
            this.RadioBtnNetWork.Name = "RadioBtnNetWork";
            this.RadioBtnNetWork.Size = new System.Drawing.Size(65, 16);
            this.RadioBtnNetWork.TabIndex = 4;
            this.RadioBtnNetWork.Text = "NetWork";
            this.RadioBtnNetWork.UseVisualStyleBackColor = true;
            this.RadioBtnNetWork.CheckedChanged += new System.EventHandler(this.RadioBtnNetWork_CheckedChanged);
            // 
            // btnSplitWnd
            // 
            this.btnSplitWnd.Location = new System.Drawing.Point(8, 88);
            this.btnSplitWnd.Name = "btnSplitWnd";
            this.btnSplitWnd.Size = new System.Drawing.Size(112, 23);
            this.btnSplitWnd.TabIndex = 5;
            this.btnSplitWnd.Text = "Make one window";
            this.btnSplitWnd.UseVisualStyleBackColor = true;
            this.btnSplitWnd.Click += new System.EventHandler(this.btnSplitWnd_Click);
            // 
            // btnSendText
            // 
            this.btnSendText.Location = new System.Drawing.Point(8, 128);
            this.btnSendText.Name = "btnSendText";
            this.btnSendText.Size = new System.Drawing.Size(112, 23);
            this.btnSendText.TabIndex = 5;
            this.btnSendText.Text = "Send Text";
            this.btnSendText.UseVisualStyleBackColor = true;
            this.btnSendText.Click += new System.EventHandler(this.btnSendText_Click);
            // 
            // btnSendPicture
            // 
            this.btnSendPicture.Location = new System.Drawing.Point(8, 168);
            this.btnSendPicture.Name = "btnSendPicture";
            this.btnSendPicture.Size = new System.Drawing.Size(112, 23);
            this.btnSendPicture.TabIndex = 5;
            this.btnSendPicture.Text = "Send Picture";
            this.btnSendPicture.UseVisualStyleBackColor = true;
            this.btnSendPicture.Click += new System.EventHandler(this.btnSendPicture_Click);
            // 
            // btnSendStaticText
            // 
            this.btnSendStaticText.Location = new System.Drawing.Point(8, 208);
            this.btnSendStaticText.Name = "btnSendStaticText";
            this.btnSendStaticText.Size = new System.Drawing.Size(112, 23);
            this.btnSendStaticText.TabIndex = 5;
            this.btnSendStaticText.Text = "Send Static Text";
            this.btnSendStaticText.UseVisualStyleBackColor = true;
            this.btnSendStaticText.Click += new System.EventHandler(this.btnSendStaticText_Click);
            // 
            // btnSendClock
            // 
            this.btnSendClock.Location = new System.Drawing.Point(8, 248);
            this.btnSendClock.Name = "btnSendClock";
            this.btnSendClock.Size = new System.Drawing.Size(112, 23);
            this.btnSendClock.TabIndex = 5;
            this.btnSendClock.Text = "Send Clock";
            this.btnSendClock.UseVisualStyleBackColor = true;
            this.btnSendClock.Click += new System.EventHandler(this.btnSendClock_Click);
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.Location = new System.Drawing.Point(140, 10);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(53, 12);
            this.label1.TabIndex = 6;
            this.label1.Text = "COM Port";
            // 
            // label2
            // 
            this.label2.AutoSize = true;
            this.label2.Location = new System.Drawing.Point(140, 50);
            this.label2.Name = "label2";
            this.label2.Size = new System.Drawing.Size(47, 12);
            this.label2.TabIndex = 6;
            this.label2.Text = "IP Addr";
            // 
            // label3
            // 
            this.label3.AutoSize = true;
            this.label3.Location = new System.Drawing.Point(306, 12);
            this.label3.Name = "label3";
            this.label3.Size = new System.Drawing.Size(59, 12);
            this.label3.TabIndex = 6;
            this.label3.Text = "Baud rate";
            // 
            // label4
            // 
            this.label4.AutoSize = true;
            this.label4.Location = new System.Drawing.Point(306, 52);
            this.label4.Name = "label4";
            this.label4.Size = new System.Drawing.Size(47, 12);
            this.label4.TabIndex = 6;
            this.label4.Text = "IP Port";
            // 
            // label5
            // 
            this.label5.AutoSize = true;
            this.label5.Location = new System.Drawing.Point(484, 14);
            this.label5.Name = "label5";
            this.label5.Size = new System.Drawing.Size(83, 12);
            this.label5.TabIndex = 6;
            this.label5.Text = "Controller ID";
            // 
            // label6
            // 
            this.label6.AutoSize = true;
            this.label6.Location = new System.Drawing.Point(484, 50);
            this.label6.Name = "label6";
            this.label6.Size = new System.Drawing.Size(47, 12);
            this.label6.TabIndex = 6;
            this.label6.Text = "ID Code";
            // 
            // m_cmbPort
            // 
            this.m_cmbPort.FormattingEnabled = true;
            this.m_cmbPort.Location = new System.Drawing.Point(199, 8);
            this.m_cmbPort.Name = "m_cmbPort";
            this.m_cmbPort.Size = new System.Drawing.Size(96, 20);
            this.m_cmbPort.TabIndex = 7;
            this.m_cmbPort.SelectedIndexChanged += new System.EventHandler(this.m_cmbPort_SelectedIndexChanged);
            // 
            // m_cmbBaudrate
            // 
            this.m_cmbBaudrate.FormattingEnabled = true;
            this.m_cmbBaudrate.Items.AddRange(new object[] {
            "115200",
            "57600",
            "38400",
            "19200",
            "9600",
            "4800"});
            this.m_cmbBaudrate.Location = new System.Drawing.Point(371, 7);
            this.m_cmbBaudrate.Name = "m_cmbBaudrate";
            this.m_cmbBaudrate.Size = new System.Drawing.Size(96, 20);
            this.m_cmbBaudrate.TabIndex = 7;
            this.m_cmbBaudrate.SelectedIndexChanged += new System.EventHandler(this.m_cmbBaudrate_SelectedIndexChanged);
            // 
            // m_cmbID
            // 
            this.m_cmbID.FormattingEnabled = true;
            this.m_cmbID.Location = new System.Drawing.Point(576, 10);
            this.m_cmbID.Name = "m_cmbID";
            this.m_cmbID.Size = new System.Drawing.Size(96, 20);
            this.m_cmbID.TabIndex = 7;
            this.m_cmbID.SelectedIndexChanged += new System.EventHandler(this.m_cmbID_SelectedIndexChanged);
            // 
            // IPAddr
            // 
            this.IPAddr.Location = new System.Drawing.Point(199, 46);
            this.IPAddr.Name = "IPAddr";
            this.IPAddr.Size = new System.Drawing.Size(96, 21);
            this.IPAddr.TabIndex = 8;
            this.IPAddr.Text = "192.168.1.100";
            // 
            // IPPort
            // 
            this.IPPort.Location = new System.Drawing.Point(371, 48);
            this.IPPort.Name = "IPPort";
            this.IPPort.Size = new System.Drawing.Size(96, 21);
            this.IPPort.TabIndex = 8;
            this.IPPort.Text = "5200";
            this.IPPort.TextChanged += new System.EventHandler(this.IPPort_TextChanged);
            // 
            // IDCode
            // 
            this.IDCode.Location = new System.Drawing.Point(576, 48);
            this.IDCode.Name = "IDCode";
            this.IDCode.Size = new System.Drawing.Size(96, 21);
            this.IDCode.TabIndex = 8;
            this.IDCode.Text = "255.255.255.255";
            // 
            // m_edtText
            // 
            this.m_edtText.AcceptsReturn = true;
            this.m_edtText.Location = new System.Drawing.Point(142, 122);
            this.m_edtText.Multiline = true;
            this.m_edtText.Name = "m_edtText";
            this.m_edtText.Size = new System.Drawing.Size(184, 40);
            this.m_edtText.TabIndex = 14;
            this.m_edtText.Text = "Hello";
            // 
            // m_edtPicture
            // 
            this.m_edtPicture.Location = new System.Drawing.Point(142, 170);
            this.m_edtPicture.Name = "m_edtPicture";
            this.m_edtPicture.Size = new System.Drawing.Size(184, 21);
            this.m_edtPicture.TabIndex = 16;
            this.m_edtPicture.Text = "test.bmp";
            // 
            // m_edtStaticText
            // 
            this.m_edtStaticText.Location = new System.Drawing.Point(142, 210);
            this.m_edtStaticText.Name = "m_edtStaticText";
            this.m_edtStaticText.Size = new System.Drawing.Size(184, 21);
            this.m_edtStaticText.TabIndex = 15;
            this.m_edtStaticText.Text = "Welcome";
            // 
            // btnSetTime
            // 
            this.btnSetTime.Location = new System.Drawing.Point(142, 250);
            this.btnSetTime.Name = "btnSetTime";
            this.btnSetTime.Size = new System.Drawing.Size(112, 23);
            this.btnSetTime.TabIndex = 13;
            this.btnSetTime.Text = "Set Time";
            this.btnSetTime.Click += new System.EventHandler(this.btnSetTime_Click);
            // 
            // m_edtWidth
            // 
            this.m_edtWidth.Location = new System.Drawing.Point(180, 88);
            this.m_edtWidth.Name = "m_edtWidth";
            this.m_edtWidth.Size = new System.Drawing.Size(48, 21);
            this.m_edtWidth.TabIndex = 21;
            this.m_edtWidth.Text = "64";
            this.m_edtWidth.ModifiedChanged += new System.EventHandler(this.m_edtWidth_ModifiedChanged);
            // 
            // label7
            // 
            this.label7.Location = new System.Drawing.Point(140, 90);
            this.label7.Name = "label7";
            this.label7.Size = new System.Drawing.Size(40, 16);
            this.label7.TabIndex = 17;
            this.label7.Text = "Width";
            // 
            // label8
            // 
            this.label8.Location = new System.Drawing.Point(236, 90);
            this.label8.Name = "label8";
            this.label8.Size = new System.Drawing.Size(48, 16);
            this.label8.TabIndex = 18;
            this.label8.Text = "Height";
            // 
            // m_edtHeight
            // 
            this.m_edtHeight.Location = new System.Drawing.Point(284, 88);
            this.m_edtHeight.Name = "m_edtHeight";
            this.m_edtHeight.Size = new System.Drawing.Size(48, 21);
            this.m_edtHeight.TabIndex = 22;
            this.m_edtHeight.Text = "32";
            this.m_edtHeight.ModifiedChanged += new System.EventHandler(this.m_edtHeight_ModifiedChanged);
            // 
            // btnPlayOneProgram
            // 
            this.btnPlayOneProgram.Location = new System.Drawing.Point(364, 87);
            this.btnPlayOneProgram.Name = "btnPlayOneProgram";
            this.btnPlayOneProgram.Size = new System.Drawing.Size(112, 23);
            this.btnPlayOneProgram.TabIndex = 19;
            this.btnPlayOneProgram.Text = "Play One Program";
            this.btnPlayOneProgram.Click += new System.EventHandler(this.btnPlayOneProgram_Click);
            // 
            // m_edtSelProgram
            // 
            this.m_edtSelProgram.Location = new System.Drawing.Point(492, 88);
            this.m_edtSelProgram.Name = "m_edtSelProgram";
            this.m_edtSelProgram.Size = new System.Drawing.Size(72, 21);
            this.m_edtSelProgram.TabIndex = 20;
            this.m_edtSelProgram.Text = "1";
            // 
            // Form1
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 12F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(680, 310);
            this.Controls.Add(this.m_edtWidth);
            this.Controls.Add(this.label7);
            this.Controls.Add(this.label8);
            this.Controls.Add(this.m_edtHeight);
            this.Controls.Add(this.btnPlayOneProgram);
            this.Controls.Add(this.m_edtSelProgram);
            this.Controls.Add(this.m_edtText);
            this.Controls.Add(this.m_edtPicture);
            this.Controls.Add(this.m_edtStaticText);
            this.Controls.Add(this.btnSetTime);
            this.Controls.Add(this.IDCode);
            this.Controls.Add(this.IPPort);
            this.Controls.Add(this.IPAddr);
            this.Controls.Add(this.m_cmbID);
            this.Controls.Add(this.m_cmbBaudrate);
            this.Controls.Add(this.m_cmbPort);
            this.Controls.Add(this.label2);
            this.Controls.Add(this.label4);
            this.Controls.Add(this.label6);
            this.Controls.Add(this.label5);
            this.Controls.Add(this.label3);
            this.Controls.Add(this.label1);
            this.Controls.Add(this.btnSendClock);
            this.Controls.Add(this.btnSendStaticText);
            this.Controls.Add(this.btnSendPicture);
            this.Controls.Add(this.btnSendText);
            this.Controls.Add(this.btnSplitWnd);
            this.Controls.Add(this.RadioBtnNetWork);
            this.Controls.Add(this.RadioBtnCom);
            this.Name = "Form1";
            this.Text = "C-Power Demo";
            this.Load += new System.EventHandler(this.Form1_Load);
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        public System.Windows.Forms.RadioButton RadioBtnCom;
        public System.Windows.Forms.RadioButton RadioBtnNetWork;
        private System.Windows.Forms.Button btnSplitWnd;
        private System.Windows.Forms.Button btnSendText;
        private System.Windows.Forms.Button btnSendPicture;
        private System.Windows.Forms.Button btnSendStaticText;
        private System.Windows.Forms.Button btnSendClock;
        private System.Windows.Forms.Label label1;
        private System.Windows.Forms.Label label2;
        private System.Windows.Forms.Label label3;
        private System.Windows.Forms.Label label4;
        private System.Windows.Forms.Label label5;
        private System.Windows.Forms.Label label6;
        private System.Windows.Forms.ComboBox m_cmbPort;
        private System.Windows.Forms.ComboBox m_cmbBaudrate;
        private System.Windows.Forms.ComboBox m_cmbID;
        private System.Windows.Forms.TextBox IPAddr;
        private System.Windows.Forms.TextBox IPPort;
        private System.Windows.Forms.TextBox IDCode;
        internal System.Windows.Forms.TextBox m_edtText;
        internal System.Windows.Forms.TextBox m_edtPicture;
        internal System.Windows.Forms.TextBox m_edtStaticText;
        internal System.Windows.Forms.Button btnSetTime;
        internal System.Windows.Forms.TextBox m_edtWidth;
        internal System.Windows.Forms.Label label7;
        internal System.Windows.Forms.Label label8;
        internal System.Windows.Forms.TextBox m_edtHeight;
        internal System.Windows.Forms.Button btnPlayOneProgram;
        internal System.Windows.Forms.TextBox m_edtSelProgram;

    }
}

